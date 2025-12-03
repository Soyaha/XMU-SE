#include <stdio.h>      
#include <stdlib.h>     
#include <unistd.h>     // 系统调用函数（close等）
#include <sys/types.h> 
#include <sys/socket.h> // 套接字相关函数和结构体
#include <errno.h>      // 错误码定义
#include <string.h>     // 字符串处理函数（memset等）
#include <arpa/inet.h>  // 网络地址转换函数（inet_ntoa、htons等）
#include <netinet/in.h> 

#define N 64  // 定义缓冲区大小为64字节

// 主函数：参数为命令行输入（运行格式：./server ip port）
int main(int argc, char* argv[])
{
    int sockfd;                  // 套接字文件描述符
    struct sockaddr_in myaddr;   // 服务器自身地址结构体
    struct sockaddr_in peeraddr; // 客户端地址结构体（用于存储发送方信息）
    char buf[N] = { 0 };           // 数据缓冲区
    socklen_t len;               // 地址结构体长度
    ssize_t n;                   // 接收/发送的字节数

    // 检查命令行参数是否足够（需提供IP和端口）
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
    memset(&myaddr, 0, sizeof(myaddr));
    myaddr.sin_family = AF_INET;                  // 使用IPv4地址族
    myaddr.sin_port = htons(atoi(argv[2]));       // 端口转换：字符串->整数->网络字节序
    myaddr.sin_addr.s_addr = inet_addr(argv[1]);  // IP地址转换：点分十进制字符串->网络字节序

    // 绑定套接字到指定IP和端口（UDP服务器必须绑定，否则无法接收数据）
    if (bind(sockfd, (struct sockaddr*)&myaddr, sizeof(myaddr)) == -1)
    {
        perror("bind"); // 打印绑定失败的错误信息
        exit(-1);       // 退出程序
    }

    // 初始化客户端地址结构体（清空内存）
    memset(&peeraddr, 0, sizeof(peeraddr));
    len = sizeof(peeraddr); // 初始化地址结构体长度

    // 循环接收并处理客户端数据
    while (1)
    {
        memset(buf, 0, sizeof(buf)); // 清空缓冲区

        // 接收客户端数据：从sockfd读取数据到buf，最大N字节，
        // 并将发送方（客户端）地址存储到peeraddr，长度存储到len
        n = recvfrom(sockfd, buf, N, 0, (struct sockaddr*)&peeraddr, &len);

        // 打印客户端信息及接收的数据：
        // inet_ntoa将网络字节序IP转为点分十进制字符串，ntohs将网络字节序端口转为主机字节序
        printf("from %s:%d %s\n", inet_ntoa(peeraddr.sin_addr),
            ntohs(peeraddr.sin_port), buf);

        // 将接收到的数据原封不动发回客户端（回声服务）
        sendto(sockfd, buf, n, 0, (struct sockaddr*)&peeraddr, sizeof(peeraddr));
    }

    close(sockfd); // 关闭套接字（实际因while(1)不会执行到这里）
    return 0;
}