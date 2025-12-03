#include <stdio.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <linux/input.h>

#define SET_VAL _IO('Z', 0)
#define GET_KEY _IO('Z', 1)

#define STEPPER_ON 	0 
#define STEPPER_OFF 	1 

#define KeyDevice 		"/dev/zlg72xx"
#define StepperDevice 	"/dev/stepper"
// 全局变量保持不变，用于传递按键状态
unsigned int fd_key;
unsigned int fd_stepper;
unsigned int key1 = 0;
unsigned int key2 = 0;
unsigned int times = 900;
// 顺时针转动一步序列（原线程核心逻辑提取为函数）
void stepper_clockwise_step() {
    ioctl(fd_stepper, STEPPER_ON, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_ON, 0);
    ioctl(fd_stepper, STEPPER_ON, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_ON, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_ON, 1);
    ioctl(fd_stepper, STEPPER_ON, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_ON, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_ON, 2);
    ioctl(fd_stepper, STEPPER_ON, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_ON, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_ON, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_ON, 3);
    usleep(times);
}
// 逆时针转动一步序列（原线程核心逻辑提取为函数）
void stepper_anticlockwise_step() {
    ioctl(fd_stepper, STEPPER_ON, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_ON, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_ON, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_ON, 2);
    ioctl(fd_stepper, STEPPER_ON, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_ON, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_ON, 1);
    ioctl(fd_stepper, STEPPER_ON, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_ON, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_ON, 0);
    ioctl(fd_stepper, STEPPER_ON, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);

    ioctl(fd_stepper, STEPPER_ON, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);
    usleep(times);
}
int main(int argc, const char* argv[]) {
    int key = 0;
    char value = 0;
    // 设置按键设备为非阻塞模式，避免阻塞电机转动
    int flags;
    // 打开设备
    fd_key = open(KeyDevice, O_RDWR | O_NONBLOCK);  // 非阻塞模式打开按键设备
    if (fd_key < 0) {
        perror("open key device failed");
        exit(1);
    }
    fd_stepper = open(StepperDevice, O_RDWR);
    if (fd_stepper < 0) {
        perror("Can't open stepper device");
        close(fd_key);
        return -1;
    }
    // 初始化电机（关闭所有引脚）
    ioctl(fd_stepper, STEPPER_OFF, 0);
    ioctl(fd_stepper, STEPPER_OFF, 1);
    ioctl(fd_stepper, STEPPER_OFF, 2);
    ioctl(fd_stepper, STEPPER_OFF, 3);

    printf("Turn D8 and D9 and D10 and D11 to the left, others to the right\n\n");
    printf("Push 1 to rotate clockwise (push again to stop); Push 2 to rotate counterclockwise (push again to stop)\n");
    // 单线程主循环：整合按键处理和电机转动
    while (1) {
        // 1. 处理按键输入（非阻塞，不会卡住电机）
        key = 0;  // 每次循环重置key
        // 非阻塞获取按键（若无按键，ioctl可能返回错误，忽略即可）
        if (ioctl(fd_key, GET_KEY, &key) == 0) {
            // 解析按键值为字符（与原逻辑一致）
            switch (key) {
            case 28:  value = '1'; printf("put is '1'\n"); break;
            case 27:  value = '2'; printf("put is '2'\n"); break;
            case 26:  value = '3'; printf("put is '3'\n"); break;
            case 25:  value = 'A'; printf("put is 'A'\n"); break;
            case 20:  value = '4'; printf("put is '4'\n"); break;
            case 19:  value = '5'; printf("put is '5'\n"); break;
            case 18:  value = '6'; printf("put is '6'\n"); break;
            case 17:  value = 'B'; printf("put is 'B'\n"); break;
            case 12:  value = '7'; printf("put is '7'\n"); break;
            case 11:  value = '8'; printf("put is '8'\n"); break;
            case 10:  value = '9'; printf("put is '9'\n"); break;
            case 9:   value = 'C'; printf("put is 'C'\n"); break;
            case 4:   value = '*'; printf("put is '*'\n"); break;
            case 3:   value = '0'; printf("put is '0'\n"); break;
            case 2:   value = '#'; printf("put is '#'\n"); break;
            case 1:   value = 'D'; printf("put is 'D'\n"); break;
            default:  value = 0x00; break;
            }
            // 根据按键更新转动状态（与原逻辑一致）
            if (value == '1') {
                key1 = !key1;  // 切换状态（0→1或1→0）
                key2 = 0;      // 确保转向唯一
            }
            else if (value == '2') {
                key2 = !key2;  // 切换状态
                key1 = 0;      // 确保转向唯一
            }
        }
        // 2. 根据按键状态执行电机转动（单线程核心）
        if (key1) {
            stepper_clockwise_step();  // 执行一次顺时针序列
        }
        else if (key2) {
            stepper_anticlockwise_step();  // 执行一次逆时针序列
        }
        else {
            // 若无需转动，短暂延时避免CPU空转
            usleep(10000);  // 10ms延时
        }
    }
    // 理论上不会执行到这里，仅作规范
    close(fd_stepper);
    close(fd_key);
    return 0;
}