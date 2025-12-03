#include "lis3dhdevice.h"

// 构造函数：空实现（初始化在run()中执行）
Lis3dhDevice::Lis3dhDevice()
{
}

// 析构函数：空实现（资源释放由线程退出时完成）
Lis3dhDevice::~Lis3dhDevice()
{
}

// 筛选函数：scandir遍历目录时，只保留IIO设备节点（d_name以"iio:"开头的符号链接）
int Lis3dhDevice::filter(const dirent* entry)
{
    return entry->d_type == DT_LNK && strncmp(entry->d_name, "iio:", 4) == 0;
}

// 打开传感器X/Y/Z轴设备文件，获取文件描述符
int Lis3dhDevice::openAccelDeviceXYZ(int& adcxfd_x, int& adcxfd_y, int& adcxfd_z, QString function) {
    struct dirent** namelist;
    // 遍历/sys/bus/iio/devices/目录，用filter筛选节点，alphasort排序
    int n = scandir("/sys/bus/iio/devices/", &namelist, filter, alphasort);
    if (n < 0) {
        perror("scandir");  // 遍历失败（如目录不存在）
        return -1;
    }
    bool x_opened = false, y_opened = false, z_opened = false;
    for (int i = 0; i < n; i++) {
        char device_path[1024];
        // 根据function参数，拼接对应轴的设备文件路径
        if (function.compare("X") == 0 && !x_opened) {
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_accel_x_raw", namelist[i]->d_name);
            x_opened = true;
        }
        else if (function.compare("Y") == 0 && !y_opened) {
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_accel_y_raw", namelist[i]->d_name);
            y_opened = true;
        }
        else if (function.compare("Z") == 0 && !z_opened) {
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_accel_z_raw", namelist[i]->d_name);
            z_opened = true;
        }
        else {
            continue;  // 无需打开当前轴，跳过
        }
        // 检查设备文件是否存在
        struct stat device_file_stat;
        if (stat(device_path, &device_file_stat) == 0) {
            // 打开设备文件（可读可写模式）
            int adcfd = open(device_path, O_RDWR);
            if (adcfd < 0) {
                perror("open device");  // 打开失败
                return -1;
            }
            else {
                // 将文件描述符赋值给对应轴的变量
                if (function.compare("X") == 0) adcxfd_x = adcfd;
                else if (function.compare("Y") == 0) adcxfd_y = adcfd;
                else if (function.compare("Z") == 0) adcxfd_z = adcfd;
            }
        }
        else {
            return -1;  // 文件不存在，返回失败
        }
        free(namelist[i]);  // 释放目录项内存
    }
    free(namelist);  // 释放目录列表内存
    return 0;
}

// 从设备文件读取原始数据，存入value
int Lis3dhDevice::readDeviceValue(int fd, QString& value)
{
    char buffer[64];
    // 读取数据：最多读取63字节（留1字节存结束符）
    ssize_t bytesRead = read(fd, buffer, sizeof(buffer) - 1);
    if (bytesRead > 0) {
        buffer[bytesRead] = '\0';  // 手动添加字符串结束符，避免乱码
        value = QString(buffer);   // 转换为Qt字符串，存入value
        return 0;  // 读取成功
    }
    else {
        return -1;  // 读取失败（如设备断开）
    }
}

// 读取X/Y/Z轴数据，存入成员变量
int Lis3dhDevice::readAccelValues(int adcxfd_x, int adcxfd_y, int adcxfd_z)
{
    QString value_x, value_y, value_z;
    // 读取X轴数据
    if (readDeviceValue(adcxfd_x, value_x) == 0) xValue = value_x;
    else { perror("Failed to read X-axis value"); return -1; }
    // 读取Y轴数据（核心判断轴）
    if (readDeviceValue(adcxfd_y, value_y) == 0) yValue = value_y;
    else { perror("Failed to read Y-axis value"); return -1; }
    // 读取Z轴数据
    if (readDeviceValue(adcxfd_z, value_z) == 0) zValue = value_z;
    else { perror("Failed to read Z-axis value"); return -1; }
    // 关闭文件描述符，避免资源泄漏
    close(adcxfd_x);
    close(adcxfd_y);
    close(adcxfd_z);
    return 0;
}

// 线程执行函数：循环读取传感器数据，发射翻转信号
void Lis3dhDevice::run()
{
    runningState = true;  // 标记线程运行状态
    while (runningState) {  // 循环读取，直到runningState为false
        int adcxfd_x, adcxfd_y, adcxfd_z;
        // 分别打开X/Y/Z轴设备文件
        int xret = openAccelDeviceXYZ(adcxfd_x, adcxfd_y, adcxfd_z, "X");
        int yret = openAccelDeviceXYZ(adcxfd_x, adcxfd_y, adcxfd_z, "Y");
        int zret = openAccelDeviceXYZ(adcxfd_x, adcxfd_y, adcxfd_z, "Z");
        if (xret < 0 || yret < 0 || zret < 0) {  // 任一轴打开失败
            emit stopthread();  // 发射线程停止信号
            return;
        }
        else {
            readAccelValues(adcxfd_x, adcxfd_y, adcxfd_z);  // 读取三轴数据
            // 根据Y轴数据发射翻转信号
            if (yValue.toInt() > 700) {
                emit change180();  // Y轴数据＞700，发射180度翻转信号
            }
            else {
                emit change0();    // 否则发射恢复0度信号
            }
        }
    }
}

// 切换线程运行状态（用于安全退出）
void Lis3dhDevice::changeRunningState(bool state)
{
    runningState = state;
}