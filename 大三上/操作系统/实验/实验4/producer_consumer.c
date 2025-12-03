#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <sys/mman.h>
#include <wait.h>
#include <time.h>

// 缓冲区大小
#define BUF_SIZE 5
// 信号量数量（empty, full, mutex）
#define SEM_NUM 3
// 信号量索引定义
#define EMPTY 0
#define FULL 1
#define MUTEX 2

// 共享内存结构：缓冲区+索引
typedef struct {
    int buf[BUF_SIZE];  // 缓冲区数组
    int in;             // 生产者存数据的位置（0~BUF_SIZE-1）
    int out;            // 消费者取数据的位置（0~BUF_SIZE-1）
} SharedData;

// PV操作封装（P=等待，V=释放）
void P(int semid, int sem_idx) {
    struct sembuf sem_op;
    sem_op.sem_num = sem_idx;  // 操作的信号量索引
    sem_op.sem_op = -1;        // P操作：信号量-1
    sem_op.sem_flg = SEM_UNDO; // 进程退出时自动撤销操作，防止死锁
    semop(semid, &sem_op, 1);  // 执行1个信号量操作
}

void V(int semid, int sem_idx) {
    struct sembuf sem_op;
    sem_op.sem_num = sem_idx;
    sem_op.sem_op = 1;         // V操作：信号量+1
    sem_op.sem_flg = SEM_UNDO;
    semop(semid, &sem_op, 1);
}

// 生产者进程：循环生产数据（1~100随机数），存入缓冲区
void producer(int semid, SharedData *shared) {
    srand(time(NULL));  // 初始化随机数种子
    for (int i = 0; i < 10; i++) {  // 生产10个数据后退出
        int data = rand() % 100 + 1;  // 生成1~100的随机数

        // 1. 申请空缓冲区（P(empty)），再申请缓冲区互斥权（P(mutex)）
        P(semid, EMPTY);
        P(semid, MUTEX);

        // 2. 存入缓冲区，更新in索引
        shared->buf[shared->in] = data;
        printf("生产者：存入数据 %d，缓冲区位置 %d\n", data, shared->in);
        shared->in = (shared->in + 1) % BUF_SIZE;  // 循环缓冲区

        // 3. 释放缓冲区互斥权（V(mutex)），通知消费者有新数据（V(full)）
        V(semid, MUTEX);
        V(semid, FULL);

        sleep(1);  // 模拟生产耗时，便于观察
    }
    printf("生产者：生产完成，退出\n");
}

// 消费者进程：循环从缓冲区取数据，消费（打印）
void consumer(int semid, SharedData *shared) {
    for (int i = 0; i < 10; i++) {  // 消费10个数据后退出
        // 1. 申请满缓冲区（P(full)），再申请缓冲区互斥权（P(mutex)）
        P(semid, FULL);
        P(semid, MUTEX);

        // 2. 从缓冲区取数据，更新out索引
        int data = shared->buf[shared->out];
        printf("消费者：取出数据 %d，缓冲区位置 %d\n", data, shared->out);
        shared->out = (shared->out + 1) % BUF_SIZE;

        // 3. 释放缓冲区互斥权（V(mutex)），通知生产者有空缓冲区（V(empty)）
        V(semid, MUTEX);
        V(semid, EMPTY);

        sleep(2);  // 模拟消费耗时，便于观察缓冲区满/空场景
    }
    printf("消费者：消费完成，退出\n");
}

int main() {
    int semid;         // 信号量集ID
    SharedData *shared;// 共享内存指针
    pid_t pid;         // 子进程ID
    key_t sem_key;     // 信号量关键字（用ftok生成唯一值）

    // 1. 生成信号量唯一关键字（当前目录+项目ID=1，确保不与其他信号量冲突）
    sem_key = ftok(".", 1);
    if (sem_key == -1) {
        perror("ftok failed");
        exit(1);
    }

    // 2. 创建信号量集（3个信号量：empty, full, mutex）
    semid = semget(sem_key, SEM_NUM, IPC_CREAT | 0666);  // 0666表示读写权限
    if (semid == -1) {
        perror("semget failed");
        exit(1);
    }

    // 3. 初始化信号量（semctl的SETVAL操作）
    union semun {  // semctl需要的union类型（部分系统需手动定义）
        int val;
        struct semid_ds *buf;
        unsigned short *array;
    } sem_arg;

    sem_arg.val = BUF_SIZE;  // empty初值=缓冲区大小（5）
    semctl(semid, EMPTY, SETVAL, sem_arg);

    sem_arg.val = 0;         // full初值=0（初始无数据）
    semctl(semid, FULL, SETVAL, sem_arg);

    sem_arg.val = 1;         // mutex初值=1（互斥）
    semctl(semid, MUTEX, SETVAL, sem_arg);

    // 4. 创建共享内存（匿名映射，父子进程共享，大小=SharedData结构体大小）
    shared = mmap(NULL, sizeof(SharedData), PROT_READ | PROT_WRITE, 
                  MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (shared == MAP_FAILED) {
        perror("mmap failed");
        exit(1);
    }

    // 5. 初始化共享内存（in和out初始为0，缓冲区初始值无意义）
    shared->in = 0;
    shared->out = 0;

    // 6. 创建子进程（父进程做生产者，子进程做消费者；或反之）
    pid = fork();
    if (pid == -1) {
        perror("fork failed");
        exit(1);
    } else if (pid == 0) {  // 子进程：消费者
        consumer(semid, shared);
        exit(0);
    } else {  // 父进程：生产者
        producer(semid, shared);
        wait(NULL);  // 等待子进程（消费者）结束
    }

    // 7. 实验结束：清理共享内存和信号量（避免残留）
    munmap(shared, sizeof(SharedData));  // 解除共享内存映射
    semctl(semid, 0, IPC_RMID);          // 删除信号量集（0表示忽略semnum）

    return 0;
}