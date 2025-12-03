#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// 函数声明
int display1(char *string);
int display2(char *string);

int main(int argc, char **argv)
{
    char string[] = "Embedded Linux";
    display1(string);
    display2(string);
    return 0;
}

// 打印原始字符串
int display1(char *string)
{
    printf("The original string is %s\n", string);
    return 0;
}

// 反转字符串并打印（修正后，解决内存越界和结束符问题）
int display2(char *string1)
{
    char *string2;
    int size, i;
    size = strlen(string1);
    // 分配足够内存（字符串长度 + 结束符 '\0'）
    string2 = (char *)malloc(size + 1);
    if (string2 == NULL) { // 内存分配失败时的错误处理（可选）
        printf("Memory allocation failed!\n");
        return -1;
    }
    // 逐个字符反转复制
    for (i = 0; i < size; i++) {
        string2[i] = string1[size - 1 - i];
        //string2[size-i] = string1[i];
    }
    string2[size] = '\0'; // 为字符串添加结束符，确保合法
    printf("The string afterward is %s\n", string2);
    free(string2); // 释放动态分配的内存，避免内存泄漏
    return 0;
}
