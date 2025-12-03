#include "mainwindow.h"
#include "ui_mainwindow.h"

// 主窗口构造函数：搭建界面、初始化设备与线程、绑定信号槽
MainWindow::MainWindow(QWidget* parent)
    : QMainWindow(parent)
{
    // 创建图形场景和视图（用于界面旋转）
    QGraphicsScene* scene = new QGraphicsScene(this);
    view = new QGraphicsView(scene, this);

    // 创建自定义界面（CustomWidget）
    customWidget = new CustomWidget();
    QScreen* screen = QGuiApplication::primaryScreen();  // 获取屏幕信息
    QRect screenGeometry = screen->geometry();
    int screenWidth = screenGeometry.width();
    int screenHeight = screenGeometry.height();
    customWidget->resize(screenWidth, screenHeight);  // 设置界面大小为屏幕尺寸
    customWidget->showFullScreen();  // 全屏显示
    customWidget->topLabel->raise();  // 将顶部标签置于顶层（避免被遮挡）

    // 禁用滚动条，将自定义界面添加到场景
    view->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    view->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    proxyWidget = scene->addWidget(customWidget);
    proxyWidget->setTransformOriginPoint(proxyWidget->boundingRect().center());  // 旋转原点设为界面中心
    proxyWidget->setZValue(100);  // 设置层级，确保界面可见

    // 初始化传感器设备和线程
    lis3dh = new Lis3dhDevice();
    thread3dh = new QThread();
    lis3dh->moveToThread(thread3dh);  // 传感器对象移至独立线程（避免阻塞UI）

    // 绑定线程启动信号：线程启动时执行传感器的run()函数
    connect(thread3dh, &QThread::started, lis3dh, &Lis3dhDevice::run);

    // 绑定线程停止信号：传感器发射stopthread时，安全退出线程
    connect(lis3dh, &Lis3dhDevice::stopthread, [&]() {
        if (thread3dh->isRunning()) {
            lis3dh->changeRunningState(false);  // 标记线程停止
            thread3dh->quit();  // 退出线程事件循环
        }
        });

    // 绑定界面翻转信号：传感器发射change180时，界面旋转180度
    connect(lis3dh, &Lis3dhDevice::change180, [&]() {
        if (!customWidget->is180) {  // 未旋转时才执行
            qDebug() << "turn 180";
            this->view->rotate(180);  // 旋转180度
            update();  // 刷新界面
            customWidget->is180 = true;
            customWidget->is0 = true;
        }
        });

    // 绑定界面恢复信号：传感器发射change0时，界面恢复原位
    connect(lis3dh, &Lis3dhDevice::change0, [&]() {
        if (customWidget->is0) {  // 已旋转时才执行
            qDebug() << "turn 0";
            this->view->rotate(180);  // 再次旋转180度，恢复0度
            update();
            customWidget->is180 = false;
            customWidget->is0 = false;
        }
        });

    // 绑定按钮信号槽：蜂鸣器按钮→控制槽函数；退出按钮→退出槽函数
    connect(customWidget->m_beepButton, SIGNAL(clicked()), this, SLOT(on_beep_clicked()));
    connect(customWidget->m_beepButton1, SIGNAL(clicked()), this, SLOT(on_exit_clicked()));

    // 设置视图为中心控件
    setCentralWidget(view);
}

// 蜂鸣器控制槽函数：响应按钮点击，切换蜂鸣器状态
void MainWindow::on_beep_clicked()
{
    if (customWidget->beepState == false)  // 当前关闭→开启
    {
        customWidget->beep->beepOn();  // 调用设备层开启接口
        customWidget->beepState = true;  // 更新状态标记
        customWidget->m_beepButton->setIcon(QIcon(":/icon/beepmax.png"));  // 切换图标
    }
    else  // 当前开启→关闭
    {
        customWidget->beep->beepOff();  // 调用设备层关闭接口
        customWidget->beepState = false;  // 更新状态标记
        customWidget->m_beepButton->setIcon(QIcon(":/icon/beepoff.png"));  // 切换图标
    }
}

// 退出槽函数：关闭程序
void MainWindow::on_exit_clicked()
{
    this->close();  // 关闭主窗口
    QApplication::quit();  // 退出应用程序
}

// 析构函数：释放资源
MainWindow::~MainWindow()
{
    delete customWidget->m_beepButton;  // 释放蜂鸣器按钮
    delete customWidget->m_beepButton1; // 释放退出按钮
    delete customWidget->beep;  // 释放蜂鸣器设备
}