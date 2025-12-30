# 实验代码流程图

以下是基于 `file_system_sim.c` 代码逻辑的程序流程图。

## 1. 主程序流程 （Main Function）

```mermaid
graph TD
    Start（[开始]） --> Init[初始化文件系统<br/>（位示图置0, 文件表清空）]
    Init --> Seed[设置随机数种子]
    
    %% 步骤1: 创建50个文件
    Seed --> Loop1Init[i = 1]
    Loop1Init --> Loop1Cond{i <= 50?}
    Loop1Cond -- 是 --> GenSize[生成随机大小<br/>（2KB - 10KB）]
    GenSize --> CallCreate1[调用 create_file<br/>创建 "i.txt"]
    CallCreate1 --> Loop1Inc[i++]
    Loop1Inc --> Loop1Cond
    
    %% 步骤2: 删除奇数文件
    Loop1Cond -- 否 --> Loop2Init[i = 1]
    Loop2Init --> Loop2Cond{i <= 50?}
    Loop2Cond -- 是 --> CallDel[调用 delete_file<br/>删除 "i.txt"]
    CallDel --> Loop2Inc[i = i + 2]
    Loop2Inc --> Loop2Cond
    
    %% 步骤3: 创建新文件
    Loop2Cond -- 否 --> CreateNew[创建新文件<br/>A.txt （7k）, B.txt （5k）<br/>C.txt （2k）, D.txt （9k）, E.txt （3.5k）]
    
    %% 步骤4: 输出结果
    CreateNew --> PrintFiles[调用 print_target_files<br/>输出 A-E 的索引表信息]
    PrintFiles --> PrintBitmap[调用 print_bitmap<br/>输出位示图状态]
    
    PrintBitmap --> End（[结束]）
```

## 2. 创建文件函数流程 （create_file）

```mermaid
graph TD
    CF_Start（[开始 create_file]） --> Calc[计算所需块数<br/>N = ceil（size/2） + 1 （索引块）]
    Calc --> Find[遍历位示图寻找 N 个空闲块]
    Find --> Check{找到足够的空闲块?}
    
    Check -- 否 --> Err1[打印"空间不足"错误] --> CF_End（[返回]）
    
    Check -- 是 --> CheckDir[检查文件目录是否有空位]
    CheckDir -- 否 --> Err2[打印"目录已满"错误] --> CF_End
    
    CheckDir -- 是 --> UpdateBit[更新位示图<br/>将分配的块对应的位设为 1]
    UpdateBit --> AssignIndex[分配第1个空闲块<br/>作为索引块]
    AssignIndex --> AssignData[分配其余空闲块<br/>作为数据块]
    AssignData --> Record[在文件目录中记录<br/>文件名、大小、索引块号、数据块号]
    Record --> CF_End
```

## 3. 删除文件函数流程 （delete_file）

```mermaid
graph TD
    DF_Start（[开始 delete_file]） --> Search[遍历文件目录查找文件名]
    Search --> Found{找到文件?}
    
    Found -- 否 --> Err[打印"未找到文件"错误] --> DF_End（[返回]）
    
    Found -- 是 --> GetInfo[获取文件的索引块号和数据块号列表]
    GetInfo --> FreeIndex[更新位示图<br/>将索引块对应的位设为 0]
    FreeIndex --> FreeData[更新位示图<br/>循环将所有数据块对应的位设为 0]
    FreeData --> ClearEntry[清空文件目录项<br/>（active = 0）]
    ClearEntry --> DF_End
```
