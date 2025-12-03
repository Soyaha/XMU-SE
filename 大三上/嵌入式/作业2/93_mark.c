#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

int global = 22;                  // 全局变量
char buf[] = "the test content\n";

int main(void) {
    int test = 0;  // 局部变量
    pid_t pid;

    // 打印初始信息
    if (write(STDOUT_FILENO, buf, sizeof(buf) - 1) != sizeof(buf) - 1) {
        perror("write error");
    }
    printf("fork test!\n");

    // 创建子进程（关键系统调用：fork）
    pid = fork();
    if (pid == -1) {  // fork失败
        perror("fork");
        exit(0);
    }
    else if (pid == 0) {  // 子进程（fork返回0）
        global++;   // 子进程修改全局变量
        test++;     // 子进程修改局部变量
        // 打印子进程的变量值和PID
        printf("global=%d test=%d Child, my PID is %d\n", global, test, getpid());
        exit(0);
    }
    global += 2;  // 父进程修改全局变量
    test += 2;    // 父进程修改局部变量
     // 打印父进程的变量值和PID
    printf("global=%d test=%d Parent, my PID is %d\n", global, test, getpid());
    exit(0);
}