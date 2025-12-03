#include <stdio.h>
#include <string.h>
#include <sys/msg.h>
#define KEY 1234

struct Msg { long type; char buf[512]; };

int main() {
    int msgid = msgget(KEY, IPC_CREAT | 0666);
    struct Msg msg = {.type=1};
    
    while (1) {
        printf("Sender> ");
        fgets(msg.buf, 512, stdin);
        msgsnd(msgid, &msg, strlen(msg.buf)+1, 0);
        if (strstr(msg.buf, "end")) break;
    }
    msgctl(msgid, IPC_RMID, NULL);  // 发送方删队列（实验简化）
    return 0;
}
