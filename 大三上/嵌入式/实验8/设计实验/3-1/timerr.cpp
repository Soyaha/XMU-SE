#include "timerr.h"
#include "ui_timerr.h"
#include <QTime>

Timerr::Timerr(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Timerr)
{
    ui->setupUi(this);
}

Timerr::~Timerr()
{
    delete ui;
}
void Timerr::start()
{
    timer = new QTimer(this);
    timer->setSingleShot(false);
    timer->start(1000);
    //超时发出信号
    connect(timer,SIGNAL(timeout()),this,SLOT(timeUpdateSlot()));
    timeUpdateSlot();
    ui->lcdNumber->show();
}
void Timerr::stop()
{
    timer->stop();
}
//超时处理槽函数
void Timerr::timeUpdateSlot()
{
    // 获取当前系统时间
    QTime currentTime = QTime::currentTime();
    // 格式化为 HH:mm:ss
    time = currentTime.toString("hh:mm:ss");
    
    ui->lcdNumber->display(time);
}
