# 变量替换版Makefile
CC = gcc  # 定义编译器变量
TARGET = hello  # 定义目标文件变量
SRCS = hello.c  # 定义源文件变量
HDRS = hello.h  # 定义头文件变量

# 使用变量构建规则
$(TARGET): $(SRCS) $(HDRS)
	$(CC) $(SRCS) -o $(TARGET)

# 清理规则
clean:
	rm -f $(TARGET)
