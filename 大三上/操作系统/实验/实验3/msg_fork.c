#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/msg.h>
#include <sys/wait.h>

#define MAX_MSG 512
#define MSG_KEY 1234  // 固定Key值

// 消息结构体（必须以long类型开头）
struct MsgBuf {
    long mtype;       // 消息类型（1:子进程发送）
    char text[MAX_MSG];
};

int main() {
    int msgid = msgget(MSG_KEY, IPC_CREAT | 0666);
    if (msgid == -1) { perror("msgget failed"); exit(1); }

    pid_t pid = fork();
    if (pid < 0) { perror("fork failed"); exit(1); }

    if (pid == 0) {  // 子进程：发送消息
        struct MsgBuf msg;
        msg.mtype = 1;
        while (1) {
            printf("Child> ");
            fgets(msg.text, MAX_MSG, stdin);
            msgsnd(msgid, &msg, strlen(msg.text)+1, 0);  // 发送含结束符的消息
            if (strncmp(msg.text, "end", 3) == 0) break;
        }
        printf("Child exit\n");
        exit(0);
    } else {  // 父进程：等待子进程后接收
        wait(NULL);  // 等待子进程结束
        struct MsgBuf recv_msg;
        printf("Parent receive:\n");
        while (1) {
            msgrcv(msgid, &recv_msg, MAX_MSG, 0, 0);  // 接收任意类型
            printf("  %s", recv_msg.text);
            if (strncmp(recv_msg.text, "end", 3) == 0) break;
        }
        msgctl(msgid, IPC_RMID, NULL);  // 删除队列
        printf("Parent exit\n");
    }
    return 0;
}
