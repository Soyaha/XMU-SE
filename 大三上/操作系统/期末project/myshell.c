/*
 * myshell.c
 * 简单 Shell 项目的主入口点
 * 处理命令行解析、I/O 重定向和进程创建
 */

#include "myshell.h"

int main(int argc, char *argv[]) {
    char line[MAX_BUFFER];      // 存储输入的命令行
    char *args[MAX_ARGS];       // 存储解析后的参数
    FILE *input_source = stdin; // 输入源，默认为标准输入

    // 设置 'shell' 环境变量为当前程序的路径
    setup_environment(argv[0]);

    // 检查是否通过批处理文件调用 (myshell batchfile)
    if (argc > 1) {
        input_source = fopen(argv[1], "r");
        if (!input_source) {
            fprintf(stderr, "myshell: could not open batch file %s\n", argv[1]);
            return 1;
        }
    }

    // Shell 主循环
    while (1) {
        // 非阻塞等待所有已结束的子进程，防止僵尸进程
        while (waitpid(-1, NULL, WNOHANG) > 0);

        int background = 0;     // 标记是否后台执行 (&)
        char *input_file = NULL; // 输入重定向文件 (<)
        char *output_file = NULL;// 输出重定向文件 (>, >>)
        int append_mode = 0;    // 0: 覆盖模式 (>), 1: 追加模式 (>>)

        // 如果是从键盘读取输入，则打印提示符
        if (input_source == stdin) {
            char cwd[PATH_MAX];
            if (getcwd(cwd, sizeof(cwd)) != NULL) {
                // 显示当前路径作为提示符的一部分
                printf("%s/myshell> ", cwd);
            } else {
                printf("myshell> ");
            }
        }

        // 读取一行输入
        if (fgets(line, MAX_BUFFER, input_source) == NULL) {
            break; // 遇到 EOF (文件结束) 退出循环
        }

        // 移除末尾的换行符
        line[strcspn(line, "\n")] = 0;
        
        // 跳过空行
        if (strlen(line) == 0) continue;

        // 手动解析参数，以处理特殊字符 <, >, >>, &
        int arg_count = 0;
        char *token = strtok(line, SEPARATORS);
        
        while (token != NULL) {
            if (strcmp(token, "&") == 0) {
                background = 1; // 发现后台执行符
            } else if (strcmp(token, "<") == 0) {
                token = strtok(NULL, SEPARATORS); // 获取下一个 token 作为文件名
                if (token) input_file = token;
            } else if (strcmp(token, ">") == 0) {
                token = strtok(NULL, SEPARATORS);
                if (token) output_file = token;
                append_mode = 0; // 覆盖模式
            } else if (strcmp(token, ">>") == 0) {
                token = strtok(NULL, SEPARATORS);
                if (token) output_file = token;
                append_mode = 1; // 追加模式
            } else {
                args[arg_count++] = token; // 普通参数
            }
            token = strtok(NULL, SEPARATORS);
        }
        args[arg_count] = NULL; // 参数列表以 NULL 结尾

        if (args[0] == NULL) continue; // 如果没有命令，继续下一次循环

        // 检查是否是内部命令
        // 为了支持内部命令的重定向 (如 dir > file)，我们需要预先检查命令类型
        int is_internal = 0;
        if (strcmp(args[0], "cd") == 0 || strcmp(args[0], "clr") == 0 || 
            strcmp(args[0], "dir") == 0 || strcmp(args[0], "environ") == 0 || 
            strcmp(args[0], "echo") == 0 || strcmp(args[0], "help") == 0 || 
            strcmp(args[0], "pause") == 0 || strcmp(args[0], "quit") == 0) {
            is_internal = 1;
        }

        if (is_internal) {
            // 保存原始的标准输出文件描述符
            int original_stdout = -1;
            int fd_out = -1;
            
            // 如果有输出重定向，处理文件打开和描述符替换
            if (output_file != NULL) {
                original_stdout = dup(STDOUT_FILENO);
                int flags = O_WRONLY | O_CREAT | (append_mode ? O_APPEND : O_TRUNC);
                fd_out = open(output_file, flags, 0644);
                if (fd_out >= 0) {
                    dup2(fd_out, STDOUT_FILENO); // 将 stdout 指向文件
                    close(fd_out);
                } else {
                    perror("myshell: redirection error");
                    if (original_stdout != -1) close(original_stdout); // 清理
                    continue;
                }
            }

            // 执行内部命令
            execute_internal(args);

            // 恢复标准输出
            if (output_file != NULL && original_stdout != -1) {
                dup2(original_stdout, STDOUT_FILENO);
                close(original_stdout);
            }
        } else {
            // 执行外部命令
            execute_external(args, background, input_file, output_file, append_mode);
        }
    }

    if (input_source != stdin) {
        fclose(input_source);
    }
    return 0;
}

/* 
 * 分发内部命令到对应的处理函数 
 */
int execute_internal(char **args) {
    if (strcmp(args[0], "cd") == 0) {
        cmd_cd(args);
        return 1;
    } else if (strcmp(args[0], "clr") == 0) {
        cmd_clr();
        return 1;
    } else if (strcmp(args[0], "dir") == 0) {
        cmd_dir(args);
        return 1;
    } else if (strcmp(args[0], "environ") == 0) {
        cmd_environ();
        return 1;
    } else if (strcmp(args[0], "echo") == 0) {
        cmd_echo(args);
        return 1;
    } else if (strcmp(args[0], "help") == 0) {
        cmd_help();
        return 1;
    } else if (strcmp(args[0], "pause") == 0) {
        cmd_pause();
        return 1;
    } else if (strcmp(args[0], "quit") == 0) {
        cmd_quit();
        return 1;
    }
    return 0;
}

/* 
 * 执行外部命令: 使用 fork() 和 execvp()
 * 处理输入/输出重定向和后台执行
 */
void execute_external(char **args, int background, char *input_file, char *output_file, int append_mode) {
    pid_t pid = fork(); // 创建子进程

    if (pid < 0) {
        perror("myshell: fork failed");
    } else if (pid == 0) {
        // --- 子进程代码 ---
        
        // 处理输入重定向 (<)
        if (input_file != NULL) {
            int fd_in = open(input_file, O_RDONLY);
            if (fd_in < 0) {
                perror("myshell: input file error");
                exit(1);
            }
            dup2(fd_in, STDIN_FILENO); // 将 stdin 指向文件
            close(fd_in);
        }

        // 处理输出重定向 (> 或 >>)
        if (output_file != NULL) {
            int flags = O_WRONLY | O_CREAT | (append_mode ? O_APPEND : O_TRUNC);
            int fd_out = open(output_file, flags, 0644);
            if (fd_out < 0) {
                perror("myshell: output file error");
                exit(1);
            }
            dup2(fd_out, STDOUT_FILENO); // 将 stdout 指向文件
            close(fd_out);
        }

        // 执行外部程序
        if (execvp(args[0], args) == -1) {
            fprintf(stderr, "myshell: command not found: %s\n", args[0]);
        }
        exit(EXIT_FAILURE); // 如果 execvp 失败，子进程退出
    } else {
        // --- 父进程代码 ---
        if (!background) {
            // 前台执行：等待子进程结束
            waitpid(pid, NULL, 0);
        } else {
            // 后台执行：不等待，直接打印 PID 并返回提示符
            printf("[Process running in background with PID %d]\n", pid);
        }
    }
}
