#include "widget.h"

// 主窗口构造函数：初始化UI、设备、线程、信号槽
Widget::Widget(QWidget* parent)
    : QMainWindow(parent)
{
    // 创建图形场景和视图（用于界面旋转）
    QGraphicsScene* scene = new QGraphicsScene(this);
    view = new QGraphicsView(scene, this);
    customWidget = new CustomWidget();  // 创建自定义多页面组件
    QScreen* screen = QGuiApplication::primaryScreen();
    QRect screenGeometry = screen->geometry();
    int screenWidth = screenGeometry.width();
    int screenHeight = screenGeometry.height();
    customWidget->resize(screenWidth, screenHeight);
    customWidget->showFullScreen();  // 全屏显示

    // 禁用滚动条，添加自定义组件到场景
    view->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    view->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    proxyWidget = scene->addWidget(customWidget);
    proxyWidget->setTransformOriginPoint(proxyWidget->boundingRect().center());  // 旋转原点为中心
    proxyWidget->setZValue(100);  // 置顶显示

    // 初始化加速度传感器（界面翻转用）
    lis3dh = new Lis3dhDevice();
    thread3dh = new QThread();
    lis3dh->moveToThread(thread3dh);
    thread3dh->start();  // 启动传感器线程
    // 绑定传感器线程启动信号→读取数据
    connect(thread3dh, &QThread::started, lis3dh, &Lis3dhDevice::run);
    // 传感器读取失败→安全退出线程
    connect(lis3dh, &Lis3dhDevice::stopthread, [&]() {
        if (thread3dh->isRunning()) {
            lis3dh->changeRunningState(false);
            thread3dh->quit();
        }
        });
    // 绑定界面翻转信号
    connect(lis3dh, &Lis3dhDevice::change180, [&]() {
        if (!customWidget->is180) {
            qDebug() << "turn 180";
            this->view->rotate(180);
            update();
            customWidget->is180 = true;
            customWidget->is0 = true;
        }
        });
    connect(lis3dh, &Lis3dhDevice::change0, [&]() {
        if (customWidget->is0) {
            qDebug() << "turn 0";
            this->view->rotate(180);
            update();
            customWidget->is180 = false;
            customWidget->is0 = false;
        }
        });

    // 绑定传感器数据信号→数据处理槽函数
    connect(customWidget->adc, &mixAdcDevice::sendData, this, &Widget::recvData);
    // 退出按钮→关闭程序
    connect(customWidget->exitButton, &QPushButton::clicked, this, &Widget::exitBtnClicked);
    // 页面切换→线程调度
    connect(customWidget, &CustomWidget::currentChanged, this, &Widget::handleIndexChange);
    // 温度数据→更新仪表盘
    connect(customWidget->tem, &temDevice::sendData, this, &Widget::updateCircular);
    // 继电器按钮→控制槽函数
    connect(customWidget->relayButton, &QPushButton::clicked, this, &Widget::relayButtonClicked);
    // 光电开关状态→更新图标
    connect(customWidget->light, &lightElectric::sendState, this, &Widget::handleLightElectricState);
    // 蜂鸣器按钮→控制槽函数
    connect(customWidget->beepBtn, &QPushButton::clicked, this, &Widget::beepBtnClicked);

    setCentralWidget(view);  // 设置视图为中心控件
}

// 析构函数：释放所有设备资源
Widget::~Widget()
{
    customWidget->adc->closeAdcFd();
    delete customWidget->adc;
    customWidget->tem->closeTemFd();
    delete customWidget->tem;
    customWidget->relay->closeRelayFd();
    delete customWidget->relay;
    customWidget->light->closeLightElectric();
    delete customWidget->light;
}

// 页面切换槽函数：线程安全调度传感器任务
void Widget::handleIndexChange(int index) {
    // 停止所有传感器线程和设备操作
    customWidget->adc->changeThreadState(false);
    customWidget->tem->changeThreadState(false);
    customWidget->light->changeLightState(false);
    // 关闭设备文件描述符
    customWidget->adc->closeAdcFd();
    customWidget->tem->closeTemFd();

    // 根据页面索引启动对应任务
    switch (index) {
        // ADC类传感器页面（酒精/A、燃气/S、火焰/F、光强/L）
    case 0: case 1: case 5: case 7:
        customWidget->threadPool->waitForDone();  // 等待之前任务结束
        customWidget->adc->changeThreadState(false);
        customWidget->adc->closeAdcFd();
        // 启动ADC读取任务，传入传感器类型
        customWidget->threadPool->start(new ReadAdcDataTask(
            customWidget->adc,
            index == 0 ? "A" : (index == 1 ? "S" : (index == 5 ? "F" : "L"))
        ));
        break;
        // 温度传感器页面
    case 2:
        customWidget->tem->changeThreadState(true);
        customWidget->threadPool->start(new ReadTemDataTask(customWidget->tem));
        break;
        // 光电开关页面
    case 4:
        customWidget->light->changeLightState(true);
        customWidget->threadPool->start(new ReadLightStateTask(customWidget->light));
        break;
    default:
        break;
    }
}

// 接收ADC传感器数据，分发到对应页面更新UI
void Widget::recvData(int data)
{
    int index = customWidget->currentIndex();
    switch (index) {
    case 0:  // 酒精页面→更新LED状态
        updateAlcoholLedState(data);
        break;
    case 1:  // 燃气页面→更新折线图
        updateSeries(data);
        break;
    case 5:  // 火焰页面→更新动图状态
        updateFrameState(data);
        break;
    case 7:  // 光强页面→更新LCD
        updateLightLCD(data);
        break;
    default:
        break;
    }
}

// 更新燃气折线图：最多显示10个数据点
void Widget::updateSeries(int data)
{
    if (customWidget->count > 10) {
        customWidget->chart->scroll(1, 0);  // 滚动图表
        customWidget->chart->axisX()->setRange(customWidget->count - 9, customWidget->count);  // 调整X轴范围
    }
    customWidget->gasSeries->append(customWidget->count, data);  // 添加数据点
    customWidget->count++;
}

// 更新温度半圆仪表盘
void Widget::updateCircular(float data)
{
    int updateData = static_cast<int>(data);
    customWidget->temCircular->changeValue(updateData);  // 刷新仪表盘指针和数值
}

// 蜂鸣器控制槽函数
void Widget::beepBtnClicked()
{
    if (!customWidget->isBeepOn) {
        customWidget->beep->changeBeepState(1);  // 开启蜂鸣器
        customWidget->isBeepOn = true;
        customWidget->beepBtn->setIcon(QIcon(":/icon/icon/beepmax.png"));  // 切换图标
        customWidget->beepBtn->setIconSize(QSize(300, 300));
    }
    else {
        customWidget->beep->changeBeepState(0);  // 关闭蜂鸣器
        customWidget->isBeepOn = false;
        customWidget->beepBtn->setIcon(QIcon(":/icon/icon/beepoff.png"));
        customWidget->beepBtn->setIconSize(QSize(300, 300));
    }
}

// 退出按钮槽函数：释放资源并退出程序
void Widget::exitBtnClicked()
{
    customWidget->beep->closeBeepFd();  // 关闭蜂鸣器设备文件
    this->close();
    QApplication::quit();
}

// 更新酒精检测LED状态
void Widget::updateAlcoholLedState(int data)
{
    if (data > 140) {  // 浓度超标→红色
        customWidget->Alcohol->setLedColor("red");
        customWidget->alcoholText->setText("酒精浓度超标");
    }
    else {  // 未超标→绿色
        customWidget->Alcohol->setLedColor("green");
        customWidget->alcoholText->setText("酒精浓度未超标");
    }
}

// 更新火焰检测状态（动图/静态图）
void Widget::updateFrameState(int data)
{
    if (data > 600) {  // 检测到火焰→播放动图
        customWidget->frameLabel->setMovie(customWidget->frameMovie);
        customWidget->frameMovie->start();
        customWidget->frameLabelText->setText("检测到火焰");
    }
    else {  // 未检测到→静态图
        customWidget->frameMovie->stop();
        QPixmap frameoffPixmap(":/icon/icon/frameoff.png");
        QPixmap scaledPixmapFrameOff = frameoffPixmap.scaled(300, 300, Qt::KeepAspectRatio, Qt::SmoothTransformation);
        customWidget->frameLabel->setPixmap(scaledPixmapFrameOff);
        customWidget->frameLabelText->setText("未检测到火焰");
    }
}

// 更新光强LCD显示
void Widget::updateLightLCD(int data)
{
    customWidget->lightLCD->display(data);
}

// 继电器控制槽函数
void Widget::relayButtonClicked()
{
    QPixmap relayLabelOnPixmap(":/icon/icon/relayon.png");
    QPixmap relayLabelPixmap(":/icon/icon/relay.png");
    QPixmap newrelayOn = relayLabelOnPixmap.scaled(150, 150);
    QPixmap newrelay = relayLabelPixmap.scaled(150, 150);

    if (!customWidget->relayButtonState)  // 未开启→打开
    {
        customWidget->relay->changeRelayState(1);
        customWidget->relayLabel->setPixmap(newrelayOn);
        customWidget->relayButton->setText("关闭");
        customWidget->relayButtonState = true;
    }
    else {  // 已开启→关闭
        customWidget->relay->changeRelayState(0);
        customWidget->relayLabel->setPixmap(newrelay);
        customWidget->relayButton->setText("打开");
        customWidget->relayButtonState = false;
    }
}

// 处理光电开关状态更新
void Widget::handleLightElectricState(int state)
{
    QPixmap lightLabelPixmap;
    if (state == 0) {  // 未遮挡→默认图标
        lightLabelPixmap.load(":/icon/icon/norlightswitch.png");
        customWidget->lightLabelText->setText("未检测遮挡");
    }
    else {  // 遮挡→切换图标
        lightLabelPixmap.load(":/icon/icon/lightswitch.png");
        customWidget->lightLabelText->setText("检测遮挡");
    }
    QPixmap scaledLightLabelPixmap = lightLabelPixmap.scaled(200, 200, Qt::KeepAspectRatio);
    customWidget->lightLabel->setPixmap(scaledLightLabelPixmap);
}