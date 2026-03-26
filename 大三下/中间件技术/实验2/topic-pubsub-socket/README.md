# 中间件技术实验二 - Topic 一对多收发模拟

本实验选择题目 2：模拟实现消息 topic 的一对多发送和接收。

## 功能说明

- 使用 Java Socket 模拟一个简单的消息 broker
- 支持多个订阅者同时订阅同一个 topic
- 发布者向指定 topic 发送消息后，broker 会转发给所有订阅者
- 提供一个 `DemoMain`，可以一键演示 topic 的一对多效果

## 目录结构

```text
topic-pubsub-socket/
├── README.md
└── src/
    └── lab2/
        ├── DemoMain.java
        ├── PublisherClient.java
        ├── SubscriberClient.java
        └── TopicBroker.java
```

## 编译与运行

在项目根目录下执行：

```bash
javac --release 8 -encoding UTF-8 -d out src/lab2/*.java
```

### 1. 运行一键演示

```bash
java -cp out lab2.DemoMain
```

演示会自动启动 broker、3 个订阅者，以及一个发布者，然后输出一对多转发结果。

### 2. 手动运行 broker

```bash
java -cp out lab2.TopicBroker 19092
```

### 3. 手动运行订阅者

```bash
java -cp out lab2.SubscriberClient 127.0.0.1 19092 news sub1
```

### 4. 手动运行发布者

```bash
java -cp out lab2.PublisherClient 127.0.0.1 19092 news "Hello topic"
```

## 协议说明

- `SUBSCRIBE <topic> <subscriberName>`：订阅某个 topic
- `PUBLISH <topic> <message>`：向 topic 发布一条消息

## 实验结论

topic 模式下，发布者与订阅者之间是解耦的。发布者只需要把消息发送到 topic，broker 负责把同一 topic 的消息转发给所有在线订阅者，从而实现一对多广播。