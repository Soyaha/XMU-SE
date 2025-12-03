#include "mainwindow.h"

// 主窗口构造函数：搭建界面、初始化设备与线程、绑定信号槽
MainWindow::MainWindow(QWidget* parent)
    : QMainWindow(parent)
{
    // 创建图形场景和视图（用于界面旋转）
    QGraphicsScene* scene = new QGraphicsScene(this);
    view = new QGraphicsView(scene, this);

    // 创建自定义界面（CustomWidget）
    customWidget = new CustomWidget();
    QScreen* screen = QGuiApplication::primaryScreen();
    QRect screenGeometry = screen->geometry();
    int screenWidth = screenGeometry.width();
    int screenHeight = screenGeometry.height();
    customWidget->resize(screenWidth, screenHeight);
    customWidget->showFullScreen();  // 全屏显示

    // 禁用滚动条，将自定义界面添加到场景
    view->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    view->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    proxyWidget = scene->addWidget(customWidget);
    proxyWidget->setTransformOriginPoint(proxyWidget->boundingRect().center());  // 旋转原点为界面中心
    proxyWidget->setZValue(100);  // 确保界面层级置顶

    // 初始化传感器设备和线程（界面翻转用）
    lis3dh = new Lis3dhDevice();
    thread3dh = new QThread();
    lis3dh->moveToThread(thread3dh);
    thread3dh->start();  // 启动传感器线程
    // 线程启动时，执行传感器run()函数（读取三轴数据）
    connect(thread3dh, &QThread::started, lis3dh, &Lis3dhDevice::run);
    // 传感器读取失败时，安全退出线程
    connect(lis3dh, &Lis3dhDevice::stopthread, [&]() {
        if (thread3dh->isRunning()) {
            lis3dh->changeRunningState(false);
            thread3dh->quit();
        }
        });
    // 接收change180信号，界面旋转180度
    connect(lis3dh, &Lis3dhDevice::change180, [&]() {
        if (!customWidget->is180) {
            qDebug() << "turn 180";
            this->view->rotate(180);
            update();  // 刷新界面
            customWidget->is180 = true;
            customWidget->is0 = true;
        }
        });
    // 接收change0信号，界面恢复原位
    connect(lis3dh, &Lis3dhDevice::change0, [&]() {
        if (customWidget->is0) {
            qDebug() << "turn 0";
            this->view->rotate(180);  // 再次旋转180度，抵消之前的旋转
            update();
            customWidget->is180 = false;
            customWidget->is0 = false;
        }
        });

    // 绑定数字按钮信号槽（0-9）
    for (int i = 0; i < 10; i++) {
        QPushButton* button = customWidget->numKeys->getButton(i);
        connect(button, &QPushButton::clicked, this, [this, i]() {
            numberButtonClicked(i);  // 点击时触发数字处理槽函数
            });
    }

    // 绑定功能按钮信号槽（A/B/C/D/*/#）
    connect(customWidget->AButton, &QPushButton::clicked, this, &MainWindow::letterButtonClicked);
    connect(customWidget->BButton, &QPushButton::clicked, this, &MainWindow::letterButtonClicked);
    connect(customWidget->CButton, &QPushButton::clicked, this, &MainWindow::letterButtonClicked);
    connect(customWidget->DButton, &QPushButton::clicked, this, &MainWindow::letterButtonClicked);
    connect(customWidget->EButton, &QPushButton::clicked, this, &MainWindow::letterButtonClicked);
    connect(customWidget->FButton, &QPushButton::clicked, this, &MainWindow::letterButtonClicked);

    // 绑定退出按钮信号槽
    connect(customWidget->m_exitButton1, &QPushButton::clicked, this, &MainWindow::buttonexit);

    // 设置视图为中心控件
    setCentralWidget(view);
}

// 析构函数：释放资源
MainWindow::~MainWindow()
{
    stopGettingValues();  // 停止值获取线程
    delete customWidget->Lcd;  // 释放LCD控件
    delete customWidget->dm;  // 释放小键盘/数码管设备
}

// 停止值获取线程（安全退出）
void MainWindow::stopGettingValues() {
    if (customWidget->thread->isRunning()) {
        customWidget->getter->isrunning = false;  // 设置运行标记为false
        customWidget->thread->quit();  // 退出线程事件循环
        customWidget->thread->wait();  // 等待线程结束
    }
}

// 功能按钮点击槽函数（A/B/C/D/*/#）
void MainWindow::letterButtonClicked() {
    // 获取发送信号的按钮对象
    QPushButton* button = qobject_cast<QPushButton*>(sender());
    char* c_str;
    if (button) {
        QString numberStr = button->text();  // 获取按钮显示文本（如"A" "*"）
        QByteArray ba = numberStr.toLatin1();  // 转换为Latin1编码（兼容ASCII字符）
        c_str = ba.data();  // 转换为C字符指针

        customWidget->accumulatedStr += c_str;  // 追加到累计字符串
        customWidget->dm->trunNewBuf(*c_str);  // 更新硬件数码管缓冲区
        customWidget->Lcd->display(customWidget->accumulatedStr);  // 更新LCD显示
    }
}

// 数字按钮点击槽函数（0-9）
void MainWindow::numberButtonClicked(int num) {
    QPushButton* button = customWidget->numKeys->getButton(num);
    char* c_str;
    if (button) {
        QString numberStr = button->text();  // 获取按钮文本（如"1" "0"）
        QByteArray ba = numberStr.toLatin1();
        c_str = ba.data();

        customWidget->accumulatedStr += c_str;  // 追加字符串
        customWidget->dm->trunNewBuf(*c_str);  // 更新硬件数码管
        customWidget->Lcd->display(customWidget->accumulatedStr);  // 更新LCD
    }
}

// 退出按钮槽函数：关闭程序
void MainWindow::buttonexit()
{
    customWidget->getter->isrunning = false;  // 停止值获取线程
    if (customWidget->thread->isRunning())
    {
        qDebug() << "exit";
        customWidget->dm->close();  // 关闭小键盘/数码管设备
        customWidget->thread->quit();  // 退出线程
    }
    this->close();  // 关闭主窗口
    QApplication::quit();  // 退出应用
}