#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>

#define BUF_SIZE 1024

void reverse(char *str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        char tmp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = tmp;
    }
}

int main() {
    int pipe_fd[2];    // 父→子传递原始字符串的管道
    int rev_pipe[2];   // 孙→父回传反转结果的管道（父子共享）
    char buf[BUF_SIZE] = "Hello from parent!";
    
    pipe(pipe_fd);     // 创建父子通信管道
    pipe(rev_pipe);    // 创建祖孙回传管道（父进程创建，子进程复用）
    
    pid_t pid = fork();
    if (pid == 0) {  // 子进程逻辑
        close(pipe_fd[1]);  // 子进程只需要读，关闭写端
        read(pipe_fd[0], buf, BUF_SIZE); // 读取父进程发送的原始字符串
        reverse(buf);        // 反转字符串
        
        // 子进程创建孙子进程，写回反转结果
        pid_t rev_pid = fork();
        if (rev_pid == 0) {  // 孙子进程逻辑
            close(rev_pipe[0]); // 孙子只写，关闭读端
            write(rev_pipe[1], buf, strlen(buf) + 1); // 写反转后的字符串（含结束符）
            close(rev_pipe[1]);
            exit(0);
        } else {
            wait(NULL); // 子进程等待孙子进程结束
            exit(0);
        }
    } else {  // 父进程逻辑
        close(pipe_fd[0]);  // 父进程只写，关闭读端
        write(pipe_fd[1], buf, strlen(buf) + 1); // 写原始字符串
        close(pipe_fd[1]);
        
        close(rev_pipe[1]); // 父进程只读，关闭写端
        read(rev_pipe[0], buf, BUF_SIZE); // 读取孙子进程回传的反转结果
        printf("Reversed: %s\n", buf);   // 输出：!tnarep morf olleH
        close(rev_pipe[0]);
        
        wait(NULL); // 父进程等待子进程结束
    }
    return 0;
}
