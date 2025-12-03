#include <stdio.h>
#include <stdlib.h>
#include <limits.h>  // 用于OPT算法中的INT_MAX

// -------------------------- 全局配置（可根据实验需求修改） --------------------------
#define PAGE_SEQ_LEN 20  // 页面序列长度
#define BLOCK_NUM 3      // 内存块数量（可修改为3/4/5等测试）
// 页面执行序列（可替换为随机生成或手动输入的序列）
int page_sequence[PAGE_SEQ_LEN] = { 1,5,3,4,2,1,3,4,5,7,9,2,6,8,1,5,3,7,4,9 };

// -------------------------- 辅助函数声明 --------------------------
// OPT算法：查找页面在后续序列中的下一次出现位置（无则返回INT_MAX）
int get_next_pos(int current_idx, int page, int seq[], int seq_len);
// 通用函数：判断页面是否在内存中，存在则返回索引，否则返回-1
int is_page_in_memory(int page, int memory[], int block_num);


// -------------------------- 1. 最佳置换算法（OPT） --------------------------
int opt_algorithm(int page_seq[], int seq_len, int block_num) {
    int memory[block_num];  // 模拟内存块
    int page_fault = 0;     // 缺页数计数器
    int i, j;

    // 初始化内存块（-1表示空闲）
    for (i = 0; i < block_num; i++) {
        memory[i] = -1;
    }

    // 遍历页面序列
    for (i = 0; i < seq_len; i++) {
        int current_page = page_seq[i];
        // 1. 判断当前页面是否已在内存中
        if (is_page_in_memory(current_page, memory, block_num) != -1) {
            printf("OPT: 页面[%d]已在内存，跳过\n", current_page);
            continue;
        }

        // 2. 页面不在内存，缺页数+1
        page_fault++;
        printf("OPT: 页面[%d]缺页（累计缺页%d次）\n", current_page, page_fault);

        // 3. 检查内存是否有空闲块
        int free_idx = -1;
        for (j = 0; j < block_num; j++) {
            if (memory[j] == -1) {
                free_idx = j;
                break;
            }
        }

        if (free_idx != -1) {
            // 3.1 有空闲块：直接装入
            memory[free_idx] = current_page;
            printf("OPT: 内存空闲，装入页面[%d]到块%d\n", current_page, free_idx);
        }
        else {
            // 3.2 无空闲块：查找“未来最长时间不使用”的页面替换
            int replace_idx = 0;          // 待替换的内存块索引
            int max_next_pos = -1;        // 最远的下一次出现位置

            for (j = 0; j < block_num; j++) {
                // 获取当前内存块中页面的下一次出现位置
                int next_pos = get_next_pos(i + 1, memory[j], page_seq, seq_len);
                // 选择下一次出现位置最远的页面（无后续则为INT_MAX）
                if (next_pos > max_next_pos) {
                    max_next_pos = next_pos;
                    replace_idx = j;
                }
            }

            // 执行替换
            printf("OPT: 替换块%d的页面[%d]为页面[%d]\n",
                replace_idx, memory[replace_idx], current_page);
            memory[replace_idx] = current_page;
        }

        // 打印当前内存状态
        printf("OPT: 当前内存状态：");
        for (j = 0; j < block_num; j++) {
            printf("%d ", memory[j] == -1 ? 0 : memory[j]);  // 0表示空闲
        }
        printf("\n\n");
    }

    return page_fault;  // 返回总缺页数
}


// -------------------------- 2. 先进先出算法（FIFO） --------------------------
int fifo_algorithm(int page_seq[], int seq_len, int block_num) {
    int memory[block_num];  // 模拟内存块
    int page_fault = 0;     // 缺页数计数器
    int fifo_queue[block_num];  // 模拟FIFO队列（记录页面进入顺序）
    int front = 0;          // 队列头指针（最早进入的页面）
    int rear = 0;           // 队列尾指针（最新进入的页面）
    int queue_size = 0;     // 队列当前大小
    int i, j;

    // 初始化内存块和队列
    for (i = 0; i < block_num; i++) {
        memory[i] = -1;
        fifo_queue[i] = -1;
    }

    // 遍历页面序列
    for (i = 0; i < seq_len; i++) {
        int current_page = page_seq[i];
        // 1. 判断当前页面是否已在内存中
        if (is_page_in_memory(current_page, memory, block_num) != -1) {
            printf("FIFO: 页面[%d]已在内存，跳过\n", current_page);
            continue;
        }

        // 2. 页面不在内存，缺页数+1
        page_fault++;
        printf("FIFO: 页面[%d]缺页（累计缺页%d次）\n", current_page, page_fault);

        if (queue_size < block_num) {
            // 3.1 内存有空闲：装入内存并加入队列
            memory[rear] = current_page;
            fifo_queue[rear] = current_page;
            printf("FIFO: 内存空闲，装入页面[%d]到块%d\n", current_page, rear);
            rear = (rear + 1) % block_num;  // 循环队列
            queue_size++;
        }
        else {
            // 3.2 内存满：替换队列头部（最早进入）的页面
            int old_page = fifo_queue[front];  // 最早进入的页面
            // 找到该页面在内存中的索引
            int replace_idx = is_page_in_memory(old_page, memory, block_num);
            // 执行替换
            memory[replace_idx] = current_page;
            fifo_queue[front] = current_page;  // 新页面加入队列
            printf("FIFO: 替换块%d的页面[%d]为页面[%d]\n",
                replace_idx, old_page, current_page);
            front = (front + 1) % block_num;  // 队列头后移
        }

        // 打印当前内存状态
        printf("FIFO: 当前内存状态：");
        for (j = 0; j < block_num; j++) {
            printf("%d ", memory[j] == -1 ? 0 : memory[j]);
        }
        printf("\n\n");
    }

    return page_fault;
}


// -------------------------- 3. 最近最少使用算法（LRU） --------------------------
int lru_algorithm(int page_seq[], int seq_len, int block_num) {
    int memory[block_num];    // 模拟内存块
    int timestamp[block_num]; // 记录页面最近使用时间戳
    int page_fault = 0;       // 缺页数计数器
    int current_time = 1;     // 时间戳（每处理一个页面递增）
    int i, j;

    // 初始化内存块和时间戳（-1表示空闲，0表示未使用）
    for (i = 0; i < block_num; i++) {
        memory[i] = -1;
        timestamp[i] = 0;
    }

    // 遍历页面序列
    for (i = 0; i < seq_len; i++) {
        int current_page = page_seq[i];
        int page_idx = is_page_in_memory(current_page, memory, block_num);

        // 1. 页面已在内存中：更新时间戳
        if (page_idx != -1) {
            timestamp[page_idx] = current_time;  // 标记为最新使用
            current_time++;
            printf("LRU: 页面[%d]已在内存，更新时间戳为%d\n", current_page, timestamp[page_idx]);
            continue;
        }

        // 2. 页面不在内存，缺页数+1
        page_fault++;
        printf("LRU: 页面[%d]缺页（累计缺页%d次）\n", current_page, page_fault);

        // 3. 检查内存是否有空闲块
        int free_idx = -1;
        for (j = 0; j < block_num; j++) {
            if (memory[j] == -1) {
                free_idx = j;
                break;
            }
        }

        if (free_idx != -1) {
            // 3.1 有空闲块：装入内存并记录时间戳
            memory[free_idx] = current_page;
            timestamp[free_idx] = current_time;
            current_time++;
            printf("LRU: 内存空闲，装入页面[%d]到块%d（时间戳%d）\n",
                current_page, free_idx, timestamp[free_idx]);
        }
        else {
            // 3.2 无空闲块：查找时间戳最小（最近最少使用）的页面替换
            int min_time = INT_MAX;
            int replace_idx = 0;
            for (j = 0; j < block_num; j++) {
                if (timestamp[j] < min_time) {
                    min_time = timestamp[j];
                    replace_idx = j;
                }
            }

            // 执行替换并更新时间戳
            printf("LRU: 替换块%d的页面[%d]（时间戳%d）为页面[%d]\n",
                replace_idx, memory[replace_idx], min_time, current_page);
            memory[replace_idx] = current_page;
            timestamp[replace_idx] = current_time;
            current_time++;
        }

        // 打印当前内存状态和时间戳
        printf("LRU: 当前内存状态：");
        for (j = 0; j < block_num; j++) {
            printf("%d ", memory[j] == -1 ? 0 : memory[j]);
        }
        printf(" | 时间戳：");
        for (j = 0; j < block_num; j++) {
            printf("%d ", timestamp[j]);
        }
        printf("\n\n");
    }

    return page_fault;
}


// -------------------------- 辅助函数实现 --------------------------
// 判断页面是否在内存中：存在返回索引，不存在返回-1
int is_page_in_memory(int page, int memory[], int block_num) {
    for (int i = 0; i < block_num; i++) {
        if (memory[i] == page) {
            return i;
        }
    }
    return -1;
}

// OPT算法辅助：获取页面在后续序列中的下一次出现位置（i从current_idx开始）
int get_next_pos(int current_idx, int page, int seq[], int seq_len) {
    for (int i = current_idx; i < seq_len; i++) {
        if (seq[i] == page) {
            return i;  // 返回第一次出现的索引
        }
    }
    return INT_MAX;  // 后续无出现，返回最大值
}


// -------------------------- 主函数（程序入口） --------------------------
int main() {
    int seq_len = PAGE_SEQ_LEN;
    int block_num = BLOCK_NUM;
    int opt_fault, fifo_fault, lru_fault;

    // 打印实验配置信息
    printf("==================== 内存页面调度算法实验 ====================\n");
    printf("页面执行序列：");
    for (int i = 0; i < seq_len; i++) {
        printf("%d ", page_sequence[i]);
    }
    printf("\n内存块数量：%d\n", block_num);
    printf("总页面数：%d\n", seq_len);
    printf("==============================================================\n\n");

    // 执行三种算法并统计缺页数
    opt_fault = opt_algorithm(page_sequence, seq_len, block_num);
    fifo_fault = fifo_algorithm(page_sequence, seq_len, block_num);
    lru_fault = lru_algorithm(page_sequence, seq_len, block_num);

    // 计算并打印性能指标（缺页率=缺页数/总页面数，命中率=1-缺页率）
    printf("==================== 实验结果汇总 ====================\n");
    printf("%-10s %-10s %-15s %-15s\n",
        "算法", "缺页数", "缺页率(%)", "命中率(%)");
    printf("------------------------------------------------------\n");

    // OPT结果
    double opt_rate = (double)opt_fault / seq_len * 100;
    double opt_hit = 100 - opt_rate;
    printf("%-10s %-10d %.2f          %.2f\n",
        "OPT", opt_fault, opt_rate, opt_hit);

    // FIFO结果
    double fifo_rate = (double)fifo_fault / seq_len * 100;
    double fifo_hit = 100 - fifo_rate;
    printf("%-10s %-10d %.2f          %.2f\n",
        "FIFO", fifo_fault, fifo_rate, fifo_hit);

    // LRU结果
    double lru_rate = (double)lru_fault / seq_len * 100;
    double lru_hit = 100 - lru_rate;
    printf("%-10s %-10d %.2f          %.2f\n",
        "LRU", lru_fault, lru_rate, lru_hit);
    printf("======================================================\n");

    return 0;
}