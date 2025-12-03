#include "hal_fs3399_beep.h"

int fd;  // 全局文件描述符：用于关联蜂鸣器设备文件

// 初始化蜂鸣器：打开设备文件
int beep_init()
{
    // 打开蜂鸣器设备节点（/dev/buzzer_ctl是驱动层提供的设备文件）
    fd = open(BEEP_PATH, O_RDWR);  // O_RDWR：可读可写模式
    if (fd < 0) {
        perror("open beep failed");  // 打开失败，输出错误信息（如设备不存在、权限不足）
    }
    return 0;
}

// 开启蜂鸣器：通过ioctl发送控制命令
int beep_on()
{
    // ioctl：设备控制函数，fd=设备文件描述符，BEEP_ON=控制命令（宏定义为1）
    return ioctl(fd, BEEP_ON);
}

// 关闭蜂鸣器：发送关闭命令
int beep_off()
{
    return ioctl(fd, BEEP_OFF);  // BEEP_OFF=0，设置蜂鸣器频率和占空比为0
}

// 释放资源：关闭设备文件
void beep_close()
{
    close(fd);  // 关闭文件描述符，释放系统资源
}