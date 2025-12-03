#include <stdio.h>
#include <unistd.h>
#include <sys/msg.h>
#include <sys/wait.h>
#include <stdlib.h>
#define KEY 75
#define END_TYPE 1

struct Msg { long type; char dummy[1]; };  // 最小消息体

void server() {
    int msgid = msgget(KEY, IPC_CREAT | 0666);
    struct Msg msg;
    
    printf("Server running...\n");
    while (1) {
        msgrcv(msgid, &msg, 1, 0, 0);  // 接收任意类型
        printf("(server) received %ld\n",msg.type);
        if (msg.type == END_TYPE) {
            msgctl(msgid, IPC_RMID, NULL);
            printf("Server exit\n");
            break;
        }
    }
    exit(0);
}

void client() {
    int msgid = msgget(KEY, 0666);
    struct Msg msg = {.type=0};
    
    for (int i=10; i>=1; i--) {
        msg.type = i;
        msgsnd(msgid, &msg, 1, 0);
        printf("(client) sent %d\n", i);
        usleep(100000);  // 控制发送速度
    }
    printf("Client exit\n");
    exit(0);
}

int main() {
    // 创建SERVER子进程
    if (fork() == 0) server();
    
    // 创建CLIENT子进程
    if (fork() == 0) client();
    
    // 父进程等待双结束
    wait(NULL);
    wait(NULL);
    printf("Parent exit\n");
    return 0;
}
