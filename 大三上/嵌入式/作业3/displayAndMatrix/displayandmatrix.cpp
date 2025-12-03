#include "displayandmatrix.h"

// 构造函数：初始化设备（调用HAL层初始化函数）
DisplayandMatrix::DisplayandMatrix()
{
    dis_mat_init();  // 调用HAL层dis_mat_init()，打开设备文件
}

// 获取按键值：供上层调用，获取硬件按键映射后的字符
char DisplayandMatrix::getValue()
{
    char value = Run();  // 调用HAL层Run()，获取按键字符
    return value;
}

// 更新缓冲区：软件输入（界面按钮）时，更新硬件数码管缓冲区
void DisplayandMatrix::trunNewBuf(char value)
{
    turn_new_buf(value);  // 调用HAL层turn_new_buf()，写入新字符并滚动
}

// 关闭设备：释放硬件资源
void DisplayandMatrix::close()
{
    close_dis();  // 调用HAL层close_dis()，清空缓冲区、关闭文件
}