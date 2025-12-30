/*
 * utility.c
 * 内部 Shell 命令和辅助函数的实现
 */

#include "myshell.h"

// 声明外部全局变量 environ，用于访问环境变量
extern char **environ;

/* 
 * cmd_cd: 改变当前工作目录 
 * args[1] 如果为空，打印当前目录；否则切换到 args[1] 指定的目录
 */
void cmd_cd(char **args) {
    char cwd[PATH_MAX];
    
    if (args[1] == NULL) {
        // 没有指定目录，显示当前目录
        if (getcwd(cwd, sizeof(cwd)) != NULL) {
            printf("%s\n", cwd);
        } else {
            perror("myshell: getcwd error");
        }
    } else {
        // 尝试切换到指定目录
        if (chdir(args[1]) != 0) {
            // 切换失败，打印错误信息
            fprintf(stderr, "myshell: directory not found: %s\n", args[1]);
        } else {
            // 切换成功，更新 PWD 环境变量
            if (getcwd(cwd, sizeof(cwd)) != NULL) {
                setenv("PWD", cwd, 1);
            }
        }
    }
}

/* 
 * cmd_clr: 清除屏幕 
 * 使用 ANSI 转义序列清屏
 */
void cmd_clr() {
    printf("\033[H\033[J");
}

/* 
 * cmd_dir: 列出目录内容
 * 支持指定目录，默认为当前目录 "."
 */
void cmd_dir(char **args) {
    char *path = args[1] ? args[1] : ".";
    DIR *d;
    struct dirent *dir;
    
    d = opendir(path);
    if (d) {
        // 遍历目录项并打印文件名
        while ((dir = readdir(d)) != NULL) {
            printf("%s\n", dir->d_name);
        }
        closedir(d);
    } else {
        fprintf(stderr, "myshell: cannot open directory %s\n", path);
    }
}

/* 
 * cmd_environ: 列出所有环境变量 
 */
void cmd_environ() {
    char **env = environ;
    while (*env) {
        printf("%s\n", *env);
        env++;
    }
}

/* 
 * cmd_echo: 在屏幕上显示注释并换行
 * 将多个参数用空格连接后输出
 */
void cmd_echo(char **args) {
    int i = 1;
    while (args[i] != NULL) {
        printf("%s", args[i]);
        // 如果后面还有参数，打印一个空格
        if (args[i+1] != NULL) {
            printf(" ");
        }
        i++;
    }
    printf("\n");
}

/* 
 * cmd_help: 显示用户手册
 * 使用 'more' 命令分页显示 readme 文件
 */
void cmd_help() {
    // 检查当前目录下是否存在 readme 文件
    if (access("readme", F_OK) != -1) {
        system("more readme");
    } else {
        printf("myshell: readme file not found.\n");
    }
}

/* 
 * cmd_pause: 暂停 shell 操作
 * 直到用户按下回车键
 */
void cmd_pause() {
    printf("Press Enter to continue...");
    // 循环读取字符直到读到换行符
    while (getchar() != '\n');
}

/* 
 * cmd_quit: 退出 shell 
 */
void cmd_quit() {
    exit(0);
}

/* 
 * setup_environment: 设置 shell 环境变量
 * 将 shell 变量设置为可执行程序的完整路径
 */
void setup_environment(char *program_name) {
    char path[PATH_MAX];
    
    // 获取可执行文件的绝对路径
    if (realpath(program_name, path) != NULL) {
        setenv("shell", path, 1);
    }
}