#include <stdio.h>
#include <stdbool.h>
#include <string.h>

// -------------------------- 实验参数定义（与文档一致） --------------------------
#define RESOURCE_NUM 3    // 资源类型数（R1、R2、R3）
#define PROCESS_NUM 5     // 进程数（P0~P4）

// 总资源向量 R = [10,5,7]
int total_resource[RESOURCE_NUM] = {10, 5, 7};

// 最大需求矩阵 Max（P0~P4对各资源的最大需求）
int max_demand[PROCESS_NUM][RESOURCE_NUM] = {
    {7,5,3},  // P0
    {3,2,2},  // P1
    {9,0,2},  // P2
    {2,2,2},  // P3
    {4,3,3}   // P4
};

// 已分配矩阵 A（初始全0，进程未启动）
int allocated[PROCESS_NUM][RESOURCE_NUM] = {0};

// 剩余需求矩阵 C = Max - A（初始=Max）
int need[PROCESS_NUM][RESOURCE_NUM];

// 可用资源向量 V（初始=total_resource）
int available[RESOURCE_NUM];

// 进程启动状态（0=未启动，1=已启动）
int is_running[PROCESS_NUM] = {0};

// 预设申请序列（8步：进程ID, 申请资源[R1,R2,R3]）
typedef struct {
    int pid;
    int request[RESOURCE_NUM];
} Request;

Request request_sequence[8] = {
    {0, {1,2,2}},  // 1. P0启动申请
    {1, {2,0,3}},  // 2. P1启动申请（超Max）
    {1, {2,0,1}},  // 3. P1修正启动申请
    {2, {3,0,2}},  // 4. P2启动申请
    {1, {1,0,2}},  // 5. P1运行中申请（超Need）
    {1, {0,2,0}},  // 6. P1修正运行中申请
    {3, {2,1,1}},  // 7. P3启动申请
    {4, {0,1,1}}   // 8. P4启动申请（超Available）
};

// -------------------------- 核心函数声明 --------------------------
// 1. 初始化实验数据（计算初始Need、Available）
void init_experiment();

// 2. 打印当前系统状态（Available、Allocated、Need、进程启动状态）
void print_state(int step);

// 3. 检查申请合法性（前置条件：是否超需求、超可用）
bool check_legality(int pid, int request[]);

// 4. 安全状态检查（银行家算法核心，返回是否安全+安全序列）
bool check_safe(int safe_sequence[]);

// 5. 处理单次申请（预分配→安全检查→确认分配/回滚）
void handle_request(int step, Request req);

// -------------------------- 核心函数实现 --------------------------
// 初始化：计算Need=Max-Allocated，Available=total_resource
void init_experiment() {
    for (int i = 0; i < PROCESS_NUM; i++) {
        for (int j = 0; j < RESOURCE_NUM; j++) {
            need[i][j] = max_demand[i][j] - allocated[i][j];
        }
    }
    memcpy(available, total_resource, sizeof(total_resource));
}

// 打印当前状态（适配终端可读性）
void print_state(int step) {
    printf("\n=== 第%d步申请后系统状态 ===\n", step);
    // 1. 可用资源向量
    printf("1. 可用资源向量 V: [");
    for (int j = 0; j < RESOURCE_NUM; j++) {
        printf("%d%s", available[j], j==RESOURCE_NUM-1 ? "]\n" : ", ");
    }
    // 2. 已分配矩阵 A
    printf("2. 已分配矩阵 A（行：P0~P4，列：R1~R3）:\n");
    for (int i = 0; i < PROCESS_NUM; i++) {
        printf("   P%d: [", i);
        for (int j = 0; j < RESOURCE_NUM; j++) {
            printf("%d%s", allocated[i][j], j==RESOURCE_NUM-1 ? "]\n" : ", ");
        }
    }
    // 3. 剩余需求矩阵 C
    printf("3. 剩余需求矩阵 C（行：P0~P4，列：R1~R3）:\n");
    for (int i = 0; i < PROCESS_NUM; i++) {
        printf("   P%d: [", i);
        for (int j = 0; j < RESOURCE_NUM; j++) {
            printf("%d%s", need[i][j], j==RESOURCE_NUM-1 ? "]\n" : ", ");
        }
    }
    // 4. 进程启动状态
    printf("4. 已启动进程: ");
    bool has_running = false;
    for (int i = 0; i < PROCESS_NUM; i++) {
        if (is_running[i]) {
            printf("P%d ", i);
            has_running = true;
        }
    }
    if (!has_running) printf("无");
    printf("\n");
}

// 检查申请合法性：返回true=合法，false=非法
bool check_legality(int pid, int request[]) {
    // 合法性条件1：申请量≤0 → 非法
    for (int j = 0; j < RESOURCE_NUM; j++) {
        if (request[j] < 0) {
            printf("❌ 申请量错误：P%d申请R%d=%d（需≥0）\n", pid, j+1, request[j]);
            return false;
        }
    }
    // 区分“启动申请”与“运行中申请”
    if (is_running[pid] == 0) {  // 进程未启动（启动申请）
        // 条件2：申请量≤Max（避免超最大需求）
        for (int j = 0; j < RESOURCE_NUM; j++) {
            if (request[j] > max_demand[pid][j]) {
                printf("❌ 非法申请：P%d申请R%d=%d（超最大需求%d）\n", 
                       pid, j+1, request[j], max_demand[pid][j]);
                return false;
            }
        }
    } else {  // 进程已启动（运行中申请）
        // 条件2：申请量≤Need（避免超剩余需求）
        for (int j = 0; j < RESOURCE_NUM; j++) {
            if (request[j] > need[pid][j]) {
                printf("❌ 非法申请：P%d申请R%d=%d（超剩余需求%d）\n", 
                       pid, j+1, request[j], need[pid][j]);
                return false;
            }
        }
    }
    for (int j = 0; j < RESOURCE_NUM; j++) {// 条件3：申请量≤Available（避免超可用资源）
        if (request[j] > available[j]) {
            printf("❌ 非法申请：P%d申请R%d=%d（超可用资源%d）\n", 
                   pid, j+1, request[j], available[j]);
            return false;
        }
    }
    printf("✅ 申请合法：P%d申请资源%s\n", pid, // 所有条件满足 → 合法
           request[0]==0&&request[1]==0&&request[2]==0 ? "[0,0,0]" : 
           (request[0]==0&&request[1]==0 ? "[0,0,"":""%d]" : 
           (request[0]==0 ? "[0,"":""%d,"":""%d]" : "[%d,%d,%d]")), 
           request[0], request[1], request[2]);
    return true;
}

// 安全状态检查：返回true=安全，同时填充safe_sequence（安全序列）
bool check_safe(int safe_sequence[]) {
    int work[RESOURCE_NUM];          // 工作向量（初始=Available）
    bool finish[PROCESS_NUM] = {0};  // 进程完成标志（初始=false）
    int seq_idx = 0;                 // 安全序列索引
    memcpy(work, available, sizeof(available));// 初始化work=Available
    for (int k = 0; k < PROCESS_NUM; k++) {// 循环寻找可完成的进程（最多循环PROCESS_NUM次，确保所有进程都检查）
        for (int i = 0; i < PROCESS_NUM; i++) {
            if (!finish[i] && is_running[i]) {  // 未完成且已启动的进程
                // 检查Need[i] ≤ Work
                bool can_finish = true;
                for (int j = 0; j < RESOURCE_NUM; j++) {
                    if (need[i][j] > work[j]) {
                        can_finish = false;
                        break;
                    }
                }
                if (can_finish) {
                    // 标记进程完成，释放资源到work
                    finish[i] = true;
                    for (int j = 0; j < RESOURCE_NUM; j++) {
                        work[j] += allocated[i][j];
                    }
                    safe_sequence[seq_idx++] = i;  // 加入安全序列
                }
            }
        }
    }
    // 检查所有已启动进程是否都完成（未启动进程不要求）
    bool is_safe = true;
    for (int i = 0; i < PROCESS_NUM; i++) {
        if (is_running[i] && !finish[i]) {
            is_safe = false;
            break;
        }
    }
    // 输出安全检查结果
    if (is_safe) {
        printf("✅ 系统安全！安全序列：");
        for (int i = 0; i < seq_idx; i++) {
            printf("P%d%s", safe_sequence[i], i==seq_idx-1 ? "\n" : "→");
        }
    } else {
        printf("❌ 系统不安全！无有效安全序列\n");
    }
    return is_safe;
}

// 处理单次申请：预分配→安全检查→确认/回滚
void handle_request(int step, Request req) {
    int pid = req.pid;
    int request[RESOURCE_NUM];
    memcpy(request, req.request, sizeof(request));
    // 步骤1：打印当前申请信息
    printf("\n===== 处理第%d步申请 =====\n", step);
    printf("申请进程：P%d，申请资源：[R1=%d, R2=%d, R3=%d]\n", 
           pid, request[0], request[1], request[2]);
    if (!check_legality(pid, request)) {// 步骤2：合法性检查（不合法则直接返回
        printf("⚠️  第%d步申请被拒绝，保持原状态\n", step);
        print_state(step);  // 打印原状态
        return;
    }
    for (int j = 0; j < RESOURCE_NUM; j++) {// 步骤3：预分配资源（临时修改Available、Allocated、Need）
        available[j] -= request[j];       // 可用资源减少
        allocated[pid][j] += request[j];  // 已分配资源增加
        need[pid][j] -= request[j];       // 剩余需求减少
    }
    is_running[pid] = 1;  // 标记进程为已启动（无论后续是否回滚，合法申请必启动）
    // 步骤4：安全状态检查
    int safe_sequence[PROCESS_NUM];  // 存储安全序列
    bool is_safe = check_safe(safe_sequence);
    if (is_safe) {// 步骤5：根据安全检查结果决定是否确认分配
        printf(" 第%d步申请通过，确认资源分配\n", step);
    } else {
        printf("  第%d步申请被拒绝，回滚预分配\n", step);
        // 回滚资源（恢复预分配前状态）
        for (int j = 0; j < RESOURCE_NUM; j++) {
            available[j] += request[j];
            allocated[pid][j] -= request[j];
            need[pid][j] += request[j];
        }
        // 若回滚后已分配为0，标记为未启动
        bool no_allocation = true;
        for (int j = 0; j < RESOURCE_NUM; j++) {
            if (allocated[pid][j] != 0) {
                no_allocation = false;
                break;
            }
        }
        if (no_allocation) is_running[pid] = 0;
    }
    print_state(step);// 步骤6：打印处理后的系统状态
}

// -------------------------- 主函数（程序入口） --------------------------
int main() {
    // 初始化实验数据
    init_experiment();

    // 打印初始状态
    printf("===== 《实用操作系统》实验五：死锁避免（银行家算法） =====\n");
    printf("实验参数：总资源R=[10,5,7]，进程P0~P4，共8步申请\n");
    printf("操作提示：每步申请前输入【空格】并回车，继续下一步\n");
    print_state(0);  // 第0步=初始状态

    // 处理预设的8步申请（单步交互）
    for (int step = 1; step <= 8; step++) {
        // 等待用户输入空格（单步控制）
        printf("\n--------------------------\n");
        printf("请输入【空格】并回车，处理第%d步申请：", step);
        char input;
        while (1) {
            input = getchar();
            if (input == ' ') {  // 仅接受空格输入
                break;
            } else if (input == EOF) {
                printf("\n程序终止\n");
                return 0;
            }
        }
        // 处理当前步申请
        handle_request(step, request_sequence[step-1]);
    }

    // 实验结束
    printf("\n===== 所有申请处理完成，实验结束 =====\n");
    return 0;
}