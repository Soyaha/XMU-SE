#include <stdio.h>      
#include <stdlib.h>  
#include <unistd.h>    
#include <sys/types.h> 
#include <sys/socket.h> 
#include <errno.h>    
#include <string.h>    
#include <arpa/inet.h>  
#include <netinet/in.h> 

#define N 64 


int main(int argc, char* argv[])
{
    int sockfd;                  // 套接字文件描述符
    struct sockaddr_in servaddr; // 服务器地址结构体
    char buf[N] = { 0 };           // 数据缓冲区

    // 检查命令行参数是否足够（需提供服务器IP和端口）
    if (argc < 3)
    {
        printf("usage:%s ip port\n", argv[0]); // 提示正确用法
        return 0;
    }

    // 创建UDP套接字：AF_INET（IPv4），SOCK_DGRAM（UDP协议），0（默认协议）
    if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
    {
        perror("socket"); // 打印创建套接字失败的错误信息
        exit(-1);         // 退出程序
    }

    // 初始化服务器地址结构体（清空内存）
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;                 // 使用IPv4地址族
    servaddr.sin_port = htons(atoi(argv[2]));      // 端口转换：字符串->整数->网络字节序
    servaddr.sin_addr.s_addr = inet_addr(argv[1]); // IP地址转换：点分十进制字符串->网络字节序

    // 循环向服务器发送数据并接收回复
    while (1)
    {
        printf(">");                  // 输入提示符
        fgets(buf, N, stdin);         // 从标准输入读取用户输入（含换行符）

        // 发送数据到服务器：将buf中的数据（长度为字符串长度+1，包含结束符）
        // 发送到servaddr指定的服务器地址
        sendto(sockfd, buf, strlen(buf) + 1, 0, (struct sockaddr*)&servaddr, sizeof(servaddr));

        memset(buf, 0, sizeof(buf)); // 清空缓冲区

        // 接收服务器回复：从sockfd读取数据到buf，忽略发送方地址（最后两个参数为NULL）
        recvfrom(sockfd, buf, N, 0, NULL, NULL);

        printf("%s\n", buf); // 打印服务器回复的数据
    }

    close(sockfd); // 关闭套接字（实际因while(1)不会执行到这里）
    return 0;
}