#include "temdevice.h"

// 构造函数：初始化温度传感器对象
temDevice::temDevice(QObject* parent) : QObject(parent)
{
}

// 打开I2C设备文件（温度传感器LM75连接在i2c-4总线）
void temDevice::openTemDevice()
{
    temfd = open("/dev/i2c-4", O_RDWR);  // 以读写模式打开I2C设备
    if (temfd < 0)
    {
        perror("open error");  // 打开失败输出错误
    }
}

// 读取温度数据：通过I2C接口与LM75通信
void temDevice::readData()
{
    openTemDevice();  // 打开I2C设备
    int ret = 0;
    struct i2c_rdwr_ioctl_data lm75_data;  // I2C读写消息结构体
    short temp_val = 0;

    // 初始化I2C消息参数
    lm75_data.nmsgs = 2;
    lm75_data.msgs = (struct i2c_msg*)malloc(lm75_data.nmsgs * sizeof(struct i2c_msg));
    if (!lm75_data.msgs)
    {
        perror("malloc error");
        exit(1);
    }
    ioctl(temfd, I2C_TIMEOUT, 1);/* 设置超时时间1秒 */
    ioctl(temfd, I2C_RETRIES, 2);/* 设置重试次数2次 */
    sleep(1);

    // 循环读取温度，直到isTemRunning为false
    while (isTemRunning) {
        lm75_data.nmsgs = 2;
        // 第一个消息：写入LM75数据寄存器地址（0x0）
        (lm75_data.msgs[0]).len = 1;
        (lm75_data.msgs[0]).addr = 0x4f;  // LM75设备地址0x4f
        (lm75_data.msgs[0]).flags = 0;/* 写操作 */
        (lm75_data.msgs[0]).buf = (unsigned char*)malloc(2);
        (lm75_data.msgs[0]).buf[0] = 0x0;/* 温度数据寄存器地址 */

        // 第二个消息：读取温度数据（2字节）
        (lm75_data.msgs[1]).len = 2;
        (lm75_data.msgs[1]).addr = 0x4f;
        (lm75_data.msgs[1]).flags = I2C_M_RD;/* 读操作 */
        (lm75_data.msgs[1]).buf = (unsigned char*)malloc(2);
        (lm75_data.msgs[1]).buf[0] = 0;/* 初始化读缓冲 */
        (lm75_data.msgs[1]).buf[1] = 0;

        // 执行I2C读写操作
        ret = ioctl(temfd, I2C_RDWR, (unsigned long)&lm75_data);
        if (ret < 0)
        {
            perror("ioctl error2");
            return;
        }

        // 数据转换：拼接2字节数据，处理正负温度
        temp_val = (lm75_data.msgs[1]).buf[0] << 8 | (lm75_data.msgs[1]).buf[1];
        if (temp_val >> 15)  // 负温度处理
            temp_val = (~(temp_val - 0x80) >> 7);
        else  // 正温度处理
            temp_val = temp_val >> 7;

        printf("temp =  %01f\n", (float)temp_val / 2);  // 调试输出温度
        emit sendData((float)temp_val / 2);  // 发送温度值（÷2得到实际温度）
        usleep(100000);  // 间隔100ms，减少CPU占用
    }
    closeTemFd();  // 停止读取后关闭设备文件
}

// 改变线程运行状态：控制温度读取循环的启停
void temDevice::changeThreadState(bool state)
{
    isTemRunning = state;
}

// 关闭I2C设备文件描述符
void temDevice::closeTemFd()
{
    close(temfd);
}