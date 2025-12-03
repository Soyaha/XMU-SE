#include <stdio.h>
#include <sys/msg.h>
#include <string.h>
#include <stdlib.h>
#define KEY 1234

struct Msg { long type; char buf[512]; };

int main() {
    int msgid = msgget(KEY, 0666);
    struct Msg msg;
    
    printf("Receiver waiting...\n");
    int n = msgrcv(msgid, &msg, 512, 0, 0);
    if (n == -1) {
    	perror("msgrcv failed");
        exit(1);
    }
    while (msgrcv(msgid, &msg, 512, 0, 0) > 0) {
        printf("Received> %s", msg.buf);
        if (strstr(msg.buf, "end")) break;
    }
    return 0;
}
