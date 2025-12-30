#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>

#define BLOCK_SIZE_KB 2
#define TOTAL_BLOCKS 500
#define MAX_FILES 100

// 文件结构体
typedef struct {
    char name[20];
    double size_kb;
    int index_block;      // 索引块号
    int *data_blocks;     // 数据块号数组
    int data_block_count; // 数据块数量
    int active;           // 1 表示文件存在, 0 表示已删除
} File;

// 文件系统结构体
typedef struct {
    int bitmap[TOTAL_BLOCKS]; // 位示图: 0=空闲, 1=占用. 下标0对应块号1
    File files[MAX_FILES];    // 文件目录
    int file_count;
} FileSystem;

FileSystem fs;

// 初始化文件系统
void init_fs() {
    for (int i = 0; i < TOTAL_BLOCKS; i++) {
        fs.bitmap[i] = 0;
    }
    for (int i = 0; i < MAX_FILES; i++) {
        fs.files[i].active = 0;
        fs.files[i].data_blocks = NULL;
    }
    fs.file_count = 0;
}

// 寻找 count 个空闲块
// 返回动态分配的数组，包含空闲块的下标 (0-based)
// 如果空间不足返回 NULL
int* find_free_blocks(int count) {
    int free_count = 0;
    for (int i = 0; i < TOTAL_BLOCKS; i++) {
        if (fs.bitmap[i] == 0) free_count++;
    }
    
    if (free_count < count) return NULL;

    int* blocks = (int*)malloc(count * sizeof(int));
    int found = 0;
    for (int i = 0; i < TOTAL_BLOCKS && found < count; i++) {
        if (fs.bitmap[i] == 0) {
            blocks[found++] = i;
        }
    }
    return blocks;
}

// 创建文件
void create_file(const char* name, double size_kb) {
    // 1. 计算所需块数
    int num_data_blocks = (int)ceil(size_kb / BLOCK_SIZE_KB);
    int total_needed = num_data_blocks + 1; // +1 用于索引块
    // 2. 寻找空闲块
    int* free_blocks = find_free_blocks(total_needed);
    if (free_blocks == NULL) {
        printf("[失败] 空间不足: %s (%.2f KB)\n", name, size_kb);
        return;
    }
    // 3. 寻找目录项空位
    int file_idx = -1;
    for (int i = 0; i < MAX_FILES; i++) {
        if (!fs.files[i].active) {
            file_idx = i;
            break;
        }
    }
    if (file_idx == -1) {
        printf("[失败] 文件目录已满\n");
        free(free_blocks);
        return;
    }
    // 4. 更新位示图
    for (int i = 0; i < total_needed; i++) {
        fs.bitmap[free_blocks[i]] = 1;
    }
    // 5. 填写文件信息
    File* f = &fs.files[file_idx];
    strcpy(f->name, name);
    f->size_kb = size_kb;
    f->active = 1;
    // 第一个空闲块作为索引块 (转换为1-based显示)
    f->index_block = free_blocks[0] + 1; 
    
    f->data_block_count = num_data_blocks;
    f->data_blocks = (int*)malloc(num_data_blocks * sizeof(int));
    for (int i = 0; i < num_data_blocks; i++) {
        // 其余作为数据块 (转换为1-based显示)
        f->data_blocks[i] = free_blocks[i+1] + 1; 
    }

    free(free_blocks);
}

// 删除文件
void delete_file(const char* name) {
    for (int i = 0; i < MAX_FILES; i++) {
        if (fs.files[i].active && strcmp(fs.files[i].name, name) == 0) {
            File* f = &fs.files[i];
            
            // 释放索引块 (转回0-based下标)
            fs.bitmap[f->index_block - 1] = 0;
            
            // 释放数据块
            for (int j = 0; j < f->data_block_count; j++) {
                fs.bitmap[f->data_blocks[j] - 1] = 0;
            }
            
            free(f->data_blocks);
            f->data_blocks = NULL;
            f->active = 0;
            return;
        }
    }
    printf("[错误] 未找到文件: %s\n", name);
}

// 打印指定文件的状态
void print_target_files(const char* target_names[], int count) {
    printf("\n======================================================================\n");
    printf("%-10s | %-10s | %-10s | %s\n", "文件名", "大小(KB)", "索引块号", "数据块号列表");
    printf("----------------------------------------------------------------------\n");
    
    for (int k = 0; k < count; k++) {
        int found = 0;
        for (int i = 0; i < MAX_FILES; i++) {
            if (fs.files[i].active && strcmp(fs.files[i].name, target_names[k]) == 0) {
                File* f = &fs.files[i];
                printf("%-10s | %-10.2f | %-10d | ", f->name, f->size_kb, f->index_block);
                for (int j = 0; j < f->data_block_count; j++) {
                    printf("%d ", f->data_blocks[j]);
                }
                printf("\n");
                found = 1;
                break;
            }
        }
        if (!found) {
            printf("%-10s | 未找到\n", target_names[k]);
        }
    }
    printf("======================================================================\n");
}

// 打印位示图
void print_bitmap() {
    int used = 0;
    for(int i=0; i<TOTAL_BLOCKS; i++) if(fs.bitmap[i]) used++;
    
    printf("\n--- 空闲区块状态 (位示图: 0=空, 1=占) ---\n");
    printf("总块数: %d, 已用: %d, 空闲: %d\n", TOTAL_BLOCKS, used, TOTAL_BLOCKS - used);
    
    for (int i = 0; i < TOTAL_BLOCKS; i++) {
        if (i % 50 == 0) {
            int end = (i + 50 > TOTAL_BLOCKS) ? TOTAL_BLOCKS : i + 50;
            printf("\n块 %03d-%03d: ", i+1, end);
        }
        printf("%d", fs.bitmap[i]);
    }
    printf("\n");
}

int main() {
    // 设置固定随机种子，确保结果可复现
    srand(2023); 
    
    init_fs();
    printf("实验开始: 磁盘容量 %d 块 * %dKB\n", TOTAL_BLOCKS, BLOCK_SIZE_KB);

    // 1. 随机生成 50 个文件 (1.txt - 50.txt)
    printf("\n[步骤1] 创建 50 个文件 (1.txt - 50.txt)...\n");
    char name[20];
    for (int i = 1; i <= 50; i++) {
        sprintf(name, "%d.txt", i);
        // 随机大小 2k - 10k
        // rand() % 81 生成 0-80, 除以10.0得到 0.0-8.0, 加上2.0得到 2.0-10.0
        double size = 2.0 + (rand() % 81) / 10.0; 
        create_file(name, size);
    }

    // 2. 删除奇数文件
    printf("\n[步骤2] 删除奇数文件 (1.txt, 3.txt...)\n");
    for (int i = 1; i <= 50; i += 2) {
        sprintf(name, "%d.txt", i);
        delete_file(name);
    }

    // 3. 创建新文件 A-E
    printf("\n[步骤3] 创建新文件 A, B, C, D, E...\n");
    create_file("A.txt", 7.0);
    create_file("B.txt", 5.0);
    create_file("C.txt", 2.0);
    create_file("D.txt", 9.0);
    create_file("E.txt", 3.5);

    // 4. 输出结果
    const char* targets[] = {"A.txt", "B.txt", "C.txt", "D.txt", "E.txt"};
    print_target_files(targets, 5);
    print_bitmap();

    // 清理内存 (可选，程序结束会自动释放)
    for(int i=0; i<MAX_FILES; i++) {
        if(fs.files[i].data_blocks) free(fs.files[i].data_blocks);
    }

    return 0;
}
