#include "mixadcdevice.h"

// 筛选函数：scandir遍历目录时，保留IIO设备节点（d_name以"iio:"开头的符号链接）
int mixAdcDevice::filter(const dirent* entry)
{
    return entry->d_type == DT_LNK && strncmp(entry->d_name, "iio:", 4) == 0;
}

// 构造函数：初始化ADC传感器对象
mixAdcDevice::mixAdcDevice(QObject* parent) : QObject(parent)
{
}

// 打开ADC设备文件：根据功能类型拼接设备路径
void mixAdcDevice::openAdcDevice(QString function)
{
    struct dirent** namelist;
    // 遍历/sys/bus/iio/devices/目录，筛选IIO设备
    int n = scandir("/sys/bus/iio/devices/", &namelist, filter, alphasort);
    if (n < 0) {
        perror("scandir");
    }
    for (int i = 0; i < n; i++) {
        char device_path[1024];
        // 根据功能类型拼接不同通道的设备文件路径
        if (function.compare("A") == 0) {  // 酒精→voltage4
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_voltage4_raw", namelist[i]->d_name);
        }
        else if (function.compare("F") == 0) {  // 火焰→voltage3
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_voltage3_raw", namelist[i]->d_name);
        }
        else if (function.compare("S") == 0) {  // 燃气→voltage0
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_voltage0_raw", namelist[i]->d_name);
        }
        else if (function.compare("L") == 0) {  // 光强→voltage3
            snprintf(device_path, sizeof(device_path), "/sys/bus/iio/devices/%s/in_voltage3_raw", namelist[i]->d_name);
        }
        // 检查设备文件是否存在
        struct stat device_file_stat;
        if (stat(device_path, &device_file_stat) == 0) {
            qDebug() << "IIO device with 'in_voltage_raw': " << device_path;
            adcfd = open(device_path, O_RDWR);  // 打开设备文件（读写模式）
            qDebug() << "device_path" << device_path;
            if (adcfd < 0) {
                perror("open device");  // 打开失败输出错误
            }
            else {
                qDebug() << "device openning";
            }
        }
        else {
            qDebug() << "No 'in_voltage_raw' in device directory:  " << device_path;
        }
        free(namelist[i]);  // 释放目录项内存
    }
    free(namelist);  // 释放目录列表内存
}

// 读取ADC数据：循环读取直到isAdcRunning为false
void mixAdcDevice::readData(QString function)
{
    closeAdcFd();  // 先关闭之前的设备文件
    while (isAdcRunning) {  // 运行标志为true时持续读取
        unsigned char data[20];
        int newdata = 0;
        openAdcDevice(function);  // 打开对应功能的ADC设备
        int err = read(adcfd, &data, sizeof(data));  // 读取原始数据
        if (err > 0) {
            int i = 0;
            // 解析数据：仅保留数字字符，转换为整数
            for (i = 0; i < err; i++) {
                if (data[i] >= '0' && data[i] <= '9') {
                    newdata = newdata * 10 + (data[i] - 48);
                }
            }
        }
        else {
            qDebug() << "read failed err:" << err;
        }
        int senddata = newdata * 3.8;  // 数据缩放，匹配实际物理量
        emit sendData(senddata);  // 发送数据给UI
        QThread::usleep(500000);  // 间隔500ms，减少CPU占用
        closeAdcFd();  // 关闭设备文件，避免资源泄漏
    }
}

// 改变线程运行状态：控制数据读取循环的启停
void mixAdcDevice::changeThreadState(bool state)
{
    isAdcRunning = state;
}

// 关闭ADC设备文件描述符
void mixAdcDevice::closeAdcFd()
{
    close(adcfd);
    adcfd = 0;
}