# 数据流图设计

根据《需求规格说明书》的内容，设计数据流图如下：

## 3.4.1 顶层图 (Context Diagram)

系统涉及的外部实体包括：顾客、商户、服务商、服务员工。

```mermaid
graph TD
    Customer[顾客]
    Merchant[商户]
    Provider[服务商]
    Staff[服务员工]
    System(售后与服务系统)

    %% 顾客数据流
    Customer -->|提交售后申请| System
    Customer -->|取消售后申请| System
    Customer -->|寄回商品信息| System
    Customer -->|确认服务完成| System
    System -->|售后状态与进度| Customer
    System -->|退款/重发通知| Customer
    System -->|服务进度与记录| Customer

    %% 商户数据流
    Merchant -->|审核售后申请| System
    Merchant -->|验收寄回商品| System
    Merchant -->|处理退款/重发货| System
    Merchant -->|申请服务合同| System
    Merchant -->|取消/暂停服务合同| System
    System -->|售后申请通知| Merchant
    System -->|合同状态与变更记录| Merchant

    %% 服务商数据流
    Provider -->|确认接收服务单| System
    Provider -->|派单信息| System
    Provider -->|处理服务合同| System
    Provider -->|撤销服务单| System
    System -->|新服务单通知| Provider
    System -->|合同申请通知| Provider

    %% 服务员工数据流
    Staff -->|服务处理结果| System
    System -->|派工与预约信息| Staff
```

## 3.4.2 零层图 (Level 0 DFD)

系统主要功能模块划分为：售后管理、服务单管理、服务合同管理。

```mermaid
graph TD
    %% 外部实体
    Customer[顾客]
    Merchant[商户]
    Provider[服务商]
    Staff[服务员工]

    %% 处理过程
    P1(1.0 售后管理)
    P2(2.0 服务单管理)
    P3(3.0 服务合同管理)

    %% 数据存储
    D1[(D1 售后单信息)]
    D2[(D2 服务单信息)]
    D3[(D3 服务合同信息)]
    D4[(D4 订单与商品信息)]

    %% 1.0 售后管理流
    Customer -->|售后申请/取消| P1
    Merchant -->|审核/验收/处理| P1
    P1 -->|售后状态更新| Customer
    P1 -->|售后通知| Merchant
    P1 <-->|读写| D1
    P1 -->|读取订单信息| D4
    P1 -.->|触发寄修服务| P2

    %% 2.0 服务单管理流
    D4 -.->|增值服务触发| P2
    Provider -->|接单/派单/撤销| P2
    Staff -->|处理结果| P2
    Customer -->|确认/取消服务| P2
    P2 -->|服务通知| Provider
    P2 -->|派工信息| Staff
    P2 -->|服务进度| Customer
    P2 <-->|读写| D2
    P3 -.->|验证合同权限| P2

    %% 3.0 服务合同管理流
    Merchant -->|申请/变更合同| P3
    Provider -->|审核/处理合同| P3
    P3 -->|合同状态| Merchant
    P3 -->|合同通知| Provider
    P3 <-->|读写| D3
```

## 3.4.3 一层图 (Level 1 DFD)

### 1.0 售后管理分解

```mermaid
graph TD
    Customer[顾客]
    Merchant[商户]
    
    P1_1(1.1 申请售后)
    P1_2(1.2 审核售后)
    P1_3(1.3 验收商品)
    P1_4(1.4 退款/重发处理)

    D1[(D1 售后单信息)]
    D4[(D4 订单信息)]

    Customer -->|提交申请| P1_1
    P1_1 -->|读取| D4
    P1_1 -->|创建| D1
    
    D1 -->|售后单信息| P1_2
    Merchant -->|审核结果| P1_2
    P1_2 -->|更新状态| D1
    
    Customer -->|寄回信息| P1_3
    Merchant -->|验收结果| P1_3
    P1_3 -->|更新状态| D1
    
    Merchant -->|退款/重发信息| P1_4
    P1_4 -->|更新结果| D1
    P1_4 -->|通知| Customer
```

### 2.0 服务单管理分解

```mermaid
graph TD
    Provider[服务商]
    Staff[服务员工]
    
    P2_1(2.1 创建服务单)
    P2_2(2.2 分派服务)
    P2_3(2.3 执行服务)
    P2_4(2.4 验收/完成服务)

    D2[(D2 服务单信息)]
    D3[(D3 服务合同信息)]

    %% 输入源
    Source1[售后寄修] --> P2_1
    Source2[订单增值服务] --> P2_1
    
    P2_1 -->|读取| D3
    P2_1 -->|创建| D2
    
    Provider -->|接单/派单| P2_2
    D2 -->|待派单信息| P2_2
    P2_2 -->|更新派单| D2
    P2_2 -->|派工通知| Staff
    
    Staff -->|处理/上门结果| P2_3
    P2_3 -->|更新进度| D2
    
    Staff -->|完成信息| P2_4
    P2_4 -->|更新状态| D2
    P2_4 -->|完成通知| Provider
```

### 3.0 服务合同管理分解

```mermaid
graph TD
    Merchant[商户]
    Provider[服务商]

    P3_1(3.1 申请合同)
    P3_2(3.2 审核合同)
    P3_3(3.3 变更合同)

    D3[(D3 服务合同信息)]

    Merchant -->|提交合同申请| P3_1
    P3_1 -->|创建| D3
    
    D3 -->|待审核合同| P3_2
    Provider -->|处理结果| P3_2
    P3_2 -->|更新状态| D3
    
    Merchant -->|取消/暂停/恢复| P3_3
    P3_3 -->|更新状态| D3
```
