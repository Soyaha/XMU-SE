#include "widget.h"
#include "ui_widget.h"

// 构造函数：初始化服务器端窗口、TCP服务器对象及信号槽绑定
Widget::Widget(QWidget* parent)
    : QWidget(parent)
    , ui(new Ui::Widget)
{
    ui->setupUi(this);  // 初始化UI界面（加载widget.ui设计的控件：文本框、状态标签）

    tcpServer = new QTcpServer(this);  // 创建TCP服务器对象，父控件设为this（自动释放）

    // 监听本地主机（localhost）的6666端口：QHostAddress::LocalHost表示127.0.0.1
    if (!tcpServer->listen(QHostAddress::LocalHost, 6666))
    {
        qDebug() << "error" << tcpServer->errorString();  // 监听失败，输出错误信息（如端口被占用）
        close();  // 关闭窗口，终止程序
    }

    // 绑定信号槽：当有新客户端连接时（newConnection信号），触发sendMessage槽函数（发送数据）
    connect(tcpServer, SIGNAL(newConnection()), this, SLOT(sendMessage()));
}

// 析构函数：释放UI资源
Widget::~Widget()
{
    delete ui;  // 释放UI对象，避免内存泄漏
}

// 槽函数：有新客户端连接时触发，发送数据给客户端
void Widget::sendMessage()
{
    QByteArray block;  // 字节数组：暂存要发送的打包数据（长度+消息）
    // 创建数据流：绑定block，以“只写”模式操作（QIODevice::WriteOnly）
    QDataStream out(&block, QIODevice::WriteOnly);
    out.setVersion(QDataStream::Qt_4_6);  // 设置数据流版本，必须与客户端一致（避免数据解析错误）

    out << (quint16)0;  // 写入占位符：预留2字节存储消息长度（后续更新）
    qDebug() << ui->textEdit_send->toPlainText();  // 调试输出：打印要发送的消息（文本框输入内容）
    out << ui->textEdit_send->toPlainText();  // 写入实际消息（从文本框获取）

    out.device()->seek(0);  // 将数据流指针移回开头（覆盖之前的占位符）
    // 计算实际消息长度：block总长度 - 占位符长度（sizeof(quint16)=2字节）
    out << (quint16)(block.size() - sizeof(quint16));

    // 获取与客户端的连接套接字：nextPendingConnection()返回等待连接的客户端套接字
    QTcpSocket* clientConnection = tcpServer->nextPendingConnection();
    // 绑定信号槽：客户端断开连接时，自动释放套接字资源（deleteLater()延迟删除，避免野指针）
    connect(clientConnection, SIGNAL(disconnected()), clientConnection, SLOT(deleteLater()));

    clientConnection->write(block);  // 发送打包后的字节数组（长度+消息）
    clientConnection->disconnectFromHost();  // 发送完成后，主动断开与客户端的连接

    ui->statusLabel->setText("send message successful!!!");  // 界面显示发送成功提示
    qDebug() << "send message successful!!!";  // 调试输出发送成功信息
}