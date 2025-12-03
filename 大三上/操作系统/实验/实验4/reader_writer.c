#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <sys/mman.h>
#include <wait.h>
#include <string.h>
#include <time.h>

// 信号量定义（2个信号量：mutex保护read_count，wrt保护读写互斥）
#define SEM_NUM 2
#define MUTEX 0   // 保护read_count的互斥信号量
#define WRT 1     // 读写/写写互斥信号量

// 共享内存结构：共享数据 + 读者计数
typedef struct {
    char data[50];    // 共享数据（如字符串）
    int read_count;   // 当前在读的读者数量
} SharedData;

// 自定义semun类型（semctl需要）
union semun {
    int val;
    struct semid_ds *buf;
    unsigned short *array;
};

// PV操作封装（与生产者-消费者问题一致）
void P(int semid, int sem_idx) {
    struct sembuf sem_op;
    sem_op.sem_num = sem_idx;
    sem_op.sem_op = -1;
    sem_op.sem_flg = SEM_UNDO;
    semop(semid, &sem_op, 1);
}

void V(int semid, int sem_idx) {
    struct sembuf sem_op;
    sem_op.sem_num = sem_idx;
    sem_op.sem_op = 1;
    sem_op.sem_flg = SEM_UNDO;
    semop(semid, &sem_op, 1);
}

// 读者进程（读优先）：循环读共享数据
void reader(int semid, SharedData *shared, int reader_id) {
    for (int i = 0; i < 3; i++) {  // 读3次后退出
        // 1. 互斥修改read_count（P(mutex)）
        P(semid, MUTEX);
        shared->read_count++;
        // 2. 第一个读者：P(wrt)，阻止写者（读优先关键）
        if (shared->read_count == 1) {
            P(semid, WRT);
        }
        // 3. 释放read_count的互斥权（V(mutex)）
        V(semid, MUTEX);

        // 4. 读共享数据（多个读者可同时执行此步骤）
        printf("读者%d：开始读，当前读者数=%d，共享数据：%s\n", 
               reader_id, shared->read_count, shared->data);
        sleep(1);  // 模拟读耗时
        printf("读者%d：读完\n", reader_id);

        // 5. 互斥修改read_count（P(mutex)）
        P(semid, MUTEX);
        shared->read_count--;
        // 6. 最后一个读者：V(wrt)，允许写者（读优先关键）
        if (shared->read_count == 0) {
            V(semid, WRT);
        }
        // 7. 释放read_count的互斥权（V(mutex)）
        V(semid, MUTEX);

        sleep(1);  // 读者间隔一段时间再读
    }
    printf("读者%d：退出\n", reader_id);
}

// 写者进程：循环写共享数据（随机字符串）
void writer(int semid, SharedData *shared, int writer_id) {
    srand(time(NULL) + writer_id);  // 不同写者随机数种子不同
    char new_data[50];
    for (int i = 0; i < 2; i++) {  // 写2次后退出
        // 1. P(wrt)：申请写权限（确保无读者/其他写者）
        P(semid, WRT);

        // 2. 写共享数据（独占访问）
        snprintf(new_data, sizeof(new_data), "Writer%d_Data_%d", writer_id, i+1);
        strcpy(shared->data, new_data);
        printf("写者%d：开始写，共享数据更新为：%s\n", writer_id, new_data);
        sleep(2);  // 模拟写耗时
        printf("写者%d：写完\n", writer_id);

        // 3. V(wrt)：释放写权限
        V(semid, WRT);

        sleep(2);  // 写者间隔一段时间再写
    }
    printf("写者%d：退出\n", writer_id);
}

int main() {
    int semid;         // 信号量集ID
    SharedData *shared;// 共享内存指针
    pid_t pid;         // 子进程ID
    key_t sem_key;     // 信号量关键字（与生产者-消费者问题不同，避免冲突）
    int i;

    // 1. 生成信号量唯一关键字（当前目录+项目ID=2）
    sem_key = ftok(".", 2);
    if (sem_key == -1) {
        perror("ftok failed");
        exit(1);
    }

    // 2. 创建信号量集（2个信号量：mutex, wrt）
    semid = semget(sem_key, SEM_NUM, IPC_CREAT | 0666);
    if (semid == -1) {
        perror("semget failed");
        exit(1);
    }

    // 3. 初始化信号量
    union semun sem_arg;
    sem_arg.val = 1;  // mutex初值=1（保护read_count）
    semctl(semid, MUTEX, SETVAL, sem_arg);
    sem_arg.val = 1;  // wrt初值=1（读写/写写互斥）
    semctl(semid, WRT, SETVAL, sem_arg);

    // 4. 创建共享内存（匿名映射，父子进程共享）
    shared = mmap(NULL, sizeof(SharedData), PROT_READ | PROT_WRITE, 
                  MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (shared == MAP_FAILED) {
        perror("mmap failed");
        exit(1);
    }

    // 5. 初始化共享内存（初始数据+read_count=0）
    strcpy(shared->data, "Initial_Data");
    shared->read_count = 0;

    // 6. 创建进程：2个读者 + 2个写者（用循环fork）
    // 创建读者进程（读者1、读者2）
    for (i = 1; i <= 2; i++) {
        pid = fork();
        if (pid == -1) {
            perror("fork reader failed");
            exit(1);
        } else if (pid == 0) {
            reader(semid, shared, i);
            exit(0);
        }
    }

    // 创建写者进程（写者1、写者2）
    for (i = 1; i <= 2; i++) {
        pid = fork();
        if (pid == -1) {
            perror("fork writer failed");
            exit(1);
        } else if (pid == 0) {
            writer(semid, shared, i);
            exit(0);
        }
    }

    // 7. 父进程：等待所有子进程（读者+写者）结束
    for (i = 0; i < 4; i++) {
        wait(NULL);
    }

    // 8. 清理资源
    munmap(shared, sizeof(SharedData));
    semctl(semid, 0, IPC_RMID);

    return 0;
}