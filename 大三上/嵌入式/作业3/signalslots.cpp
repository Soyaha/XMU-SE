#include "signalslots.h"
#include "ui_signalslots.h"  // 编译时由signalslots.ui生成，包含UI控件的访问接口

// 构造函数：初始化窗口和信号槽连接
SIgnalSlots::SIgnalSlots(QWidget *parent)
    : QDialog(parent)  // 继承QDialog（对话框类），指定父控件（默认nullptr，独立窗口）
    , ui(new Ui::SIgnalSlots)  // 创建UI对象（封装界面控件）
{
    ui->setupUi(this);  // 初始化UI：加载signalslots.ui设计的控件布局、样式、初始状态
    
    // 1. 按钮1与LCD1绑定：点击按钮1 → 触发pushbutten_1_Slot（LCD1加1）
    // 注：此处使用Qt旧版信号槽语法（SIGNAL/SLOT宏），需确保信号和槽函数签名完全匹配
    connect(ui->pushButton_1, SIGNAL(clicked()), this, SLOT(pushbutten_1_Slot()));
    
    // 2. 按钮2与LCD2绑定：点击按钮2 → 触发pushbutten_2_Slot（LCD2加1）
    connect(ui->pushButton_2, SIGNAL(clicked()), this, SLOT(pushbutten_2_Slot()));
    
    // 3. 按钮3与LCD1、LCD2、LCD3绑定：点击按钮3 → 触发三个槽函数（三个LCD同时加1）
    connect(ui->pushButton_3, SIGNAL(clicked()), this, SLOT(pushbutten_1_Slot()));  // 绑定LCD1
    connect(ui->pushButton_3, SIGNAL(clicked()), this, SLOT(pushbutten_2_Slot()));  // 绑定LCD2
    connect(ui->pushButton_3, SIGNAL(clicked()), this, SLOT(pushbutten_3_Slot()));  // 绑定LCD3
}

// 析构函数：释放UI资源，避免内存泄漏
SIgnalSlots::~SIgnalSlots()
{
    delete ui;  // UI对象由new创建，需手动释放（父控件不会自动回收）
}

// 槽函数：按钮1或按钮3触发，LCD1计数加1
void SIgnalSlots::pushbutten_1_Slot()
{
    // 步骤：1.获取LCD1当前值 → 2.加1 → 3.显示更新后的值
    ui->lcdNumber_1->display(ui->lcdNumber_1->value() + 1);
}

// 槽函数：按钮2或按钮3触发，LCD2计数加1
void SIgnalSlots::pushbutten_2_Slot()
{
    // 同理：获取LCD2当前值，加1后显示
    ui->lcdNumber_2->display(ui->lcdNumber_2->value() + 1);
}

// 槽函数：按钮3触发，LCD3计数加1
void SIgnalSlots::pushbutten_3_Slot()
{
    // 同理：获取LCD3当前值，加1后显示
    ui->lcdNumber_3->display(ui->lcdNumber_3->value() + 1);
}