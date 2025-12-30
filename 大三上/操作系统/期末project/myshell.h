/*
 * myshell.h
 * 简单 Shell 项目的头文件
 * 包含函数原型、宏定义和必要的库引用
 */

#ifndef MYSHELL_H
#define MYSHELL_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <dirent.h>
#include <limits.h>

// 定义缓冲区大小和最大参数数量
#define MAX_BUFFER 1024
#define MAX_ARGS 64
// 定义命令行分隔符（空格、制表符、换行符）
#define SEPARATORS " \t\n"

/* 函数原型声明 */

/* Shell 的主循环，用于处理用户命令 */
void shell_loop();

/* 执行内部命令
 * 如果是内部命令则返回 1，否则返回 0 
 */
int execute_internal(char **args);

/* 执行外部命令
 * 处理 fork、exec 以及后台执行逻辑 
 */
void execute_external(char **args, int background, char *input_file, char *output_file, int append_mode);

/* 内部命令的具体实现函数 */
void cmd_cd(char **args);       // 改变目录
void cmd_clr();                 // 清屏
void cmd_dir(char **args);      // 列出目录内容
void cmd_environ();             // 列出环境变量
void cmd_echo(char **args);     // 回显字符
void cmd_help();                // 显示帮助手册
void cmd_pause();               // 暂停 Shell
void cmd_quit();                // 退出 Shell



/* 工具函数：设置 shell 环境变量 */
void setup_environment(char *program_name);

#endif
