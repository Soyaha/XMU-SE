#include <unistd.h>
#include <sys/types.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>

// 全局变量：用于验证是否为临界资源
int shared_var = 10;

int main() {
    pid_t pid1, pid2;  // 存储两个子进程的PID（pid_t为进程ID的专用类型）
    int status;        // 用于存储wait()返回的子进程状态

    // 创建第一个子进程 
    pid1 = fork();
    if (pid1 == -1) {  // fork()失败：返回-1
        perror("fork failed (pid1)");  // 打印错误原因
        exit(EXIT_FAILURE);            // 退出程序，状态码为失败
    } else if (pid1 == 0) {            // 子进程1：fork()返回0
        printf("子进程1正在执行….. 子进程1 PID: %d, 父进程PID: %d\n", getpid(), getppid());
        // 修改全局变量，验证是否影响其他进程
        shared_var += 5;
        printf("子进程1：shared_var 初始值10 → 修改后为 %d\n", shared_var);
        // 子进程1循环执行3次（模拟并发运行），每次间隔1秒
        for (int i = 0; i < 3; i++) {
            sleep(1);
            printf("子进程1持续执行…..\n");
        }
        exit(EXIT_SUCCESS);  // 子进程1正常退出
    }

    // 创建第二个子进程
    // 此代码块仅父进程会执行（子进程1已在上述分支中exit）
    pid2 = fork();
    if (pid2 == -1) {  // fork()失败
        perror("fork failed (pid2)");
        exit(EXIT_FAILURE);
    } else if (pid2 == 0) {  // fork()返回0
        printf("子进程2正在执行….. 子进程2 PID: %d, 父进程PID: %d\n", getpid(), getppid());
        // 修改全局变量，验证是否影响其他进程
        shared_var -= 3;
        printf("子进程2：shared_var 初始值10 → 修改后为 %d\n", shared_var);
        for (int i = 0; i < 3; i++) {
            sleep(1);
            printf("子进程2持续执行…..\n");
        }
        exit(EXIT_SUCCESS);  // 子进程2正常退出
    }

    // 父进程逻辑 
    // 父进程：fork()返回子进程PID（pid1>0且pid2>0）
    printf("父进程正在执行….. 父进程PID: %d\n", getpid());
    printf("父进程：shared_var 初始值为 %d（未修改）\n", shared_var);
    
    // 父进程延迟5秒：让子进程先并发执行一段时间
    sleep(5);

    // 杀死两个子进程：使用SIGTERM信号（终止信号，较温和）
    if (kill(pid1, SIGTERM) == 0) {
        printf("子进程1被父进程杀死（子进程1 PID: %d）\n", pid1);
    } else {
        perror("kill pid1 failed");
    }
    if (kill(pid2, SIGTERM) == 0) {
        printf("子进程2被父进程杀死（子进程2 PID: %d）\n", pid2);
    } else {
        perror("kill pid2 failed");
    }

    // 等待所有子进程终止
    wait(&status);  
    wait(&status); 

    // 父进程退出
    printf("父进程结束\n");
    return 0;
}
