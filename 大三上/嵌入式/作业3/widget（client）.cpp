#include "widget.h"
#include "ui_widget.h"

// 构造函数：初始化客户端窗口、TCP套接字及信号槽绑定
Widget::Widget(QWidget* parent)
    : QWidget(parent)
    , ui(new Ui::Widget)
{
    ui->setupUi(this);  // 初始化UI界面（加载widget.ui设计的控件：主机输入框、端口输入框、连接按钮、接收标签）

    tcpSocket = new QTcpSocket(this);  // 创建TCP套接字对象（用于与服务器通信）

    // 绑定信号槽1：有数据到达时（readyRead信号），触发readMessage槽函数（接收并解析数据）
    connect(tcpSocket, SIGNAL(readyRead()), this, SLOT(readMessage()));
    // 绑定信号槽2：网络出错时（error信号），触发displayError槽函数（显示错误信息）
    connect(tcpSocket, SIGNAL(error(QAbstractSocket::SocketError)),
        this, SLOT(displayError(QAbstractSocket::SocketError)));
    // 绑定信号槽3：点击连接按钮时（clicked信号），触发pushButton_clicked槽函数（发起连接）
    connect(ui->pushButton, SIGNAL(clicked()), this, SLOT(pushButton_clicked()));
}

// 析构函数：释放UI资源
Widget::~Widget()
{
    delete ui;  // 释放UI对象，避免内存泄漏
}

// 槽函数：发起与服务器的TCP连接
void Widget::newConnect()
{
    blockSize = 0;  // 初始化数据长度变量（每次连接重置，避免旧数据干扰）
    tcpSocket->abort();  // 取消当前所有已存在的连接（避免重复连接导致的异常）

    // 发起连接：主机地址从hostLineEdit获取，端口号从portLineEdit获取（转为整数）
    tcpSocket->connectToHost(ui->hostLineEdit->text(),
        ui->portLineEdit->text().toInt());
}

// 槽函数：接收并解析服务器发送的数据
void Widget::readMessage()
{
    QDataStream in(tcpSocket);  // 创建数据流，绑定tcpSocket（从套接字读取数据）
    in.setVersion(QDataStream::Qt_4_6);  // 数据流版本与服务器一致（关键：避免解析错误）

    // 阶段1：读取数据长度（blockSize）
    if (blockSize == 0)  // 尚未读取到数据长度（首次接收数据）
    {
        // 判断已接收的数据是否≥2字节（quint16类型的长度）：若不足则返回，继续等待数据
        if (tcpSocket->bytesAvailable() < (int)sizeof(quint16)) return;
        in >> blockSize;  // 读取2字节的长度信息，存入blockSize
    }

    // 阶段2：读取实际消息
    // 判断已接收的数据是否≥blockSize（实际消息长度）：若不足则返回，继续等待数据
    if (tcpSocket->bytesAvailable() < blockSize) return;
    in >> message;  // 读取blockSize长度的实际消息，存入message变量

    ui->messageLabel->setText(message);  // 在界面标签中显示接收的消息
}

// 槽函数：显示网络错误信息
void Widget::displayError(QAbstractSocket::SocketError)
{
    // 输出错误信息：errorString()返回人类可读的错误描述（如Connection refused）
    qDebug() << "error" << tcpSocket->errorString();
}

// 槽函数：连接按钮点击事件触发，调用newConnect发起连接
void Widget::pushButton_clicked()
{
    newConnect();  // 转发到newConnect函数，发起TCP连接
}