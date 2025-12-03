#include "circularprogressbar.h"

// 构造函数：初始化控件核心资源
Circularprogressbar::Circularprogressbar(QWidget* parent)
    : QWidget(parent)  // 继承QWidget，指定父控件（默认nullptr，无父控件）
{
    myTimer = new QTimer(this);  // 创建定时器，父控件设为this（自动随控件销毁，避免内存泄漏）
    // 连接定时器的timeout信号到槽函数decreaseColorProgress：定时器触发时更新进度
    connect(myTimer, &QTimer::timeout, this, &Circularprogressbar::decreaseColorProgress);
}

// 绘制外圈大圆（暗灰色背景环）
void Circularprogressbar::drawBiggestCircle(QPainter& painter, int radius) {
    painter.save();  // 保存当前画家状态（如平移、画笔设置），后续可通过restore()恢复
    QPainterPath path;  // 路径对象：用于绘制复杂图形（此处绘制圆形）
    // 添加椭圆（圆形是椭圆的特殊情况）：左上角(-radius,-radius)，宽高2*radius（以原点为中心）
    path.addEllipse(-radius, -radius, 2 * radius, 2 * radius);
    painter.setBrush(QColor(54, 54, 54));  // 设置填充色为暗灰色（RGB：54,54,54）
    painter.drawPath(path);  // 绘制路径（填充暗灰色圆形）
    painter.restore();  // 恢复画家之前的状态，避免影响后续绘制
}

// 绘制内圈小圆（窗口背景色，用于形成环形间隙）
void Circularprogressbar::drawLittleCircle(QPainter& painter, int radius) {
    painter.save();
    QPainterPath path;
    // 内圈半径=传入的radius（已在外层计算为外圈半径-50），绘制中心对齐的小圆
    path.addEllipse(-radius, -radius, 2 * radius, 2 * radius);
    // 获取控件的窗口背景色（与父控件背景色一致，确保视觉统一）
    QColor ringColor = palette().color(QPalette::Window);
    painter.setBrush(ringColor);  // 设置填充色为窗口背景色
    painter.drawPath(path);  // 绘制内圈小圆，遮挡中间区域
    painter.restore();
}

// 绘制彩色进度环（核心绘制函数）
void Circularprogressbar::drawColor(QPainter& painter, int radius)
{
    // 定义彩色环的外接矩形：以原点为中心，宽高2*radius（与外圈大圆尺寸一致）
    QRect rect(-radius, -radius, 2 * radius, 2 * radius);
    // 创建锥形渐变对象：中心(0,0)，起始角度0度（3点钟方向）
    QConicalGradient Conical(0, 0, 0);

    // 配置渐变颜色节点（按角度占比设置，0→1对应0度→360度）
    Conical.setColorAt(0, QColor(128, 0, 255));    // 0度：深紫色
    Conical.setColorAt(0.05, QColor(128, 0, 255)); // 18度：深紫色（过渡，避免突变）
    Conical.setColorAt(0.2, QColor(255, 0, 0));    // 72度：红色
    Conical.setColorAt(0.4, QColor(255, 165, 0));  // 144度：橙色
    Conical.setColorAt(0.6, QColor(0, 128, 0));    // 216度：浅绿色
    Conical.setColorAt(0.8, QColor(0, 255, 255));  // 288度：青色
    Conical.setColorAt(0.95, QColor(0, 0, 255));   // 342度：蓝色
    Conical.setColorAt(1.0, QColor(128, 0, 255));  // 360度：深紫色（闭环，与起始色一致）

    painter.setBrush(Conical);  // 设置填充色为锥形渐变
    // 绘制扇形进度环：
    // startAngle：-180*16（顺时针180度，即9点钟方向，作为进度起始点）
    // spanAngle：-(currentColorProgress*16)（顺时针跨越currentColorProgress度，负号表示顺时针）
    painter.drawPie(rect, -180 * 16, -(currentColorProgress * 16));
}

// 重写paintEvent：控件重绘时自动调用，定义绘制流程
void Circularprogressbar::paintEvent(QPaintEvent* event) {
    Q_UNUSED(event);  // 标记event未使用，避免编译器警告
    QPainter painter(this);  // 创建画家对象，绘图设备为当前控件
    int width = this->width();  // 获取控件当前宽度
    int height = this->height();// 获取控件当前高度

    // 关键：将画家原点平移到控件中心（后续绘图以中心为原点，方便圆形居中）
    painter.translate(width / 2, height / 2);
    painter.setRenderHint(QPainter::Antialiasing, true);  // 开启抗锯齿，使图形边缘平滑
    painter.setPen(Qt::NoPen);  // 取消画笔（仅填充颜色，不绘制轮廓线）

    int outerRadius = std::min(width, height) / 2;  // 外圈半径：取宽高最小值的一半（避免圆形拉伸）
    int innerRadius = outerRadius - 50;  // 内圈半径：外圈半径减50，形成环形间隙

    drawBiggestCircle(painter, outerRadius);  // 第一层：绘制外圈暗灰色大圆
    drawColor(painter, outerRadius);          // 第二层：绘制彩色进度环（覆盖在外圈内侧）
    drawLittleCircle(painter, innerRadius);   // 第三层：绘制内圈背景色小圆（遮挡中间）
}

// 重写keyPressEvent：处理键盘按下事件
void Circularprogressbar::keyPressEvent(QKeyEvent* event)
{
    // 判断是否按下空格键
    if (event->key() == Qt::Key_Space)
    {
        myTimer->start();  // 启动定时器，开始触发进度更新
        direction = true;  // 标记为“进度增加”模式
        update();  // 触发paintEvent重绘控件（立即更新进度显示）
    }
}

// 重写keyReleaseEvent：处理键盘释放事件
void Circularprogressbar::keyReleaseEvent(QKeyEvent* event)
{
    // 判断是否松开空格键
    if (event->key() == Qt::Key_Space)
    {
        direction = false;  // 标记为“进度减少”模式
        update();  // 触发paintEvent重绘控件（立即更新进度显示）
    }
}

// 槽函数：定时器触发时更新进度（核心进度控制逻辑）
void Circularprogressbar::decreaseColorProgress()
{
    if (direction) {  // 进度增加模式（按下空格键）
        currentColorProgress += 3.6;  // 每次触发增加3.6度（约每秒36次触发，实际每秒增加3.6度）
        if (currentColorProgress > 360) {  // 进度上限：360度（整圈）
            currentColorProgress = 360;
        }
    }
    else {  // 进度减少模式（松开空格键）
        currentColorProgress -= 1;  // 每次触发减少1度（每秒约100次触发，实际每秒减少1度）
        if (currentColorProgress < 0) {  // 进度下限：0度（无填充）
            currentColorProgress = 0;
            myTimer->stop();  // 进度为0时停止定时器，避免无效触发
        }
    }
    update();  // 每次进度更新后，触发重绘，显示最新进度
}

// 析构函数：销毁控件时释放资源（本项目中myTimer父控件为this，会自动销毁，无需手动释放）
Circularprogressbar::~Circularprogressbar()
{
}