#include "hal_fs3399_displayandmatrix.h"

int fd = 0;  // 全局文件描述符：关联小键盘/数码管设备文件
char buf[10] = { 0 };  // 8位显示缓冲区（预留2位避免越界）

// 初始化设备：打开设备文件
int dis_mat_init()
{
    // 打开设备节点（/dev/zlg72xx是小键盘/数码管驱动提供的设备文件）
    fd = open("/dev/zlg72xx", O_RDWR);  // O_RDWR：可读可写模式
    if (fd < 0) {
        perror("open");  // 打开失败（如设备不存在、权限不足），输出错误信息
    }
    return 0;
}

// 运行设备：获取硬件按键值，映射为字符，更新缓冲区
int Run()
{
    int key = 0;  // 存储硬件按键原始值
    char value;  // 存储映射后的字符

    ioctl(fd, SET_VAL, buf);  // 发送缓冲区数据到数码管（更新显示）
    ioctl(fd, GET_KEY, &key);  // 获取硬件按键原始值（通过IOCTL命令）

    // 按键值映射：将原始key值转换为对应字符（如28→'1'）
    switch (key)
    {
    case 28: printf("put is '1'\n"); value = '1'; break;
    case 27: printf("put is '2'\n"); value = '2'; break;
    case 26: printf("put is '3'\n"); value = '3'; break;
    case 25: printf("put is 'A'\n"); value = 'A'; break;
    case 20: printf("put is '4'\n"); value = '4'; break;
    case 19: printf("put is '5'\n"); value = '5'; break;
    case 18: printf("put is '6'\n"); value = '6'; break;
    case 17: printf("put is 'B'\n"); value = 'B'; break;
    case 12: printf("put is '7'\n"); value = '7'; break;
    case 11: printf("put is '8'\n"); value = '8'; break;
    case 10: printf("put is '9'\n"); value = '9'; break;
    case 9: printf("put is 'C'\n"); value = 'C'; break;
    case 4: printf("put is '*'\n"); value = '*'; break;
    case 3: printf("put is '0'\n"); value = '0'; break;
    case 2: printf("put is '#'\n"); value = '#'; break;
    case 1: printf("put is 'D'\n"); value = 'D'; break;
    default: value = 0x00; break;  // 无按键时返回空字符
    }
    puts("==========================");

    // 缓冲区滚动：字符向左移动1位，新字符写入末尾（保留最新8位）
    for (int i = 0; i < 7; i++)
    {
        buf[i] = buf[i + 1];
    }
    buf[7] = value;

    ioctl(fd, SET_VAL, buf);  // 发送更新后的缓冲区到数码管，同步显示
    return value;  // 返回映射后的字符，供上层使用
}

// 更新缓冲区：软件输入（界面按钮）时调用，直接写入新字符
void turn_new_buf(char value) {
    // 与Run()中缓冲区逻辑一致，实现滚动效果
    for (int i = 0; i < 7; i++)
    {
        buf[i] = buf[i + 1];
    }
    buf[7] = value;
    ioctl(fd, SET_VAL, buf);  // 同步更新数码管
}

// 关闭设备：释放资源
void close_dis()
{
    memset(buf, 0, sizeof(buf));  // 清空缓冲区
    close(fd);  // 关闭设备文件描述符
    system("killall -9 qt5DisplayAndMatrix");  // 强制终止进程，避免资源泄漏
}