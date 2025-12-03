#include "beepdevice.h"

// 构造函数：初始化蜂鸣器（调用HAL层初始化函数）
beepDevice::beepDevice() {
    beep_init();  // 初始化：打开蜂鸣器设备文件
}

// 开启蜂鸣器：对外提供Qt类接口
int beepDevice::beepOn() {
    int ret;
    ret = beep_on();  // 调用HAL层beep_on()，发送开启命令
    if (ret < 0) {
        perror("open BEEP failed\n");  // 开启失败，输出错误信息
    }
    return ret;  // 返回执行结果（0=成功，-1=失败）
}

// 关闭蜂鸣器：对外提供Qt类接口
int beepDevice::beepOff() {
    int ret;
    ret = beep_off();  // 调用HAL层beep_off()，发送关闭命令
    if (ret < 0) {
        perror("open led failed\n");  // 此处错误提示笔误，应为“close BEEP failed”
    }
    return ret;
}

// 析构函数：释放蜂鸣器资源
beepDevice::~beepDevice() {
    beep_close();  // 调用HAL层beep_close()，关闭设备文件
}