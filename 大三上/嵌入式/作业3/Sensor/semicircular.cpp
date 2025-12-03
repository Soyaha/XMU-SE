#include "semicircular.h"

// 构造函数：初始化半圆仪表盘
SemiCircular::SemiCircular(QWidget* parent)
    : QWidget(parent)
{
}

// 设置仪表盘数值，计算旋转角度并刷新
void SemiCircular::changeValue(int newvalue)
{
    value = newvalue;
    degRotate = static_cast<int>(value * 1.8);  // 0-100℃对应0-180度，比例1.8
    update();  // 触发paintEvent重绘
}

// 绘制渐变区域（仪表盘背景色）
void SemiCircular::drawGradientArea(QPainter& painter, int radius)
{
    QRect rect(-radius, -radius, 2 * radius, 2 * radius);
    QConicalGradient Conical(0, 0, 0);  // 锥形渐变（中心原点，0度起始）
    // 配置渐变颜色（红→黄→绿→浅蓝）
    Conical.setColorAt(0.1, QColor(255, 34, 54));//红色
    Conical.setColorAt(0.2, QColor(222, 201, 21));//黄色
    Conical.setColorAt(0.3, QColor(28, 198, 52));//绿色
    Conical.setColorAt(0.5, QColor(61, 79, 255)); //浅蓝色
    painter.setBrush(Conical);
    // 绘制上半圆：startAngle=180*16，spanAngle=-degRotate*16（Qt角度单位为1/16度）
    painter.drawPie(rect, 180 * 16, -(degRotate) * 16);
}

// 绘制刻度线（大刻度每5个小刻度一个）
void SemiCircular::drawScale(QPainter& painter, int radius)
{
    // 动态计算刻度尺寸（基于控件基准大小）
    int scaleLengthSmall = baseSize * 0.01;
    int scaleWidthSmall = baseSize * 0.002;
    int scaleLengthBig = baseSize * 0.02;
    int scaleWidthBig = baseSize * 0.004;

    // 小刻度路径（矩形）
    QPainterPath pointPath_small;
    pointPath_small.moveTo(-scaleWidthSmall, -scaleWidthSmall);
    pointPath_small.lineTo(scaleWidthSmall, -scaleWidthSmall);
    pointPath_small.lineTo(scaleWidthSmall, scaleLengthSmall);
    pointPath_small.lineTo(-scaleWidthSmall, scaleLengthSmall);

    // 大刻度路径（矩形）
    QPainterPath pointPath_big;
    pointPath_big.moveTo(-scaleWidthBig, -scaleWidthBig);
    pointPath_big.lineTo(scaleWidthBig, -scaleWidthBig);
    pointPath_big.lineTo(scaleWidthBig, scaleLengthBig);
    pointPath_big.lineTo(-scaleWidthBig, scaleLengthBig);

    // 绘制0-180度刻度（每1.8度一个小刻度，共100个）
    for (int i = 0; i <= 100; ++i) {
        QPointF point(0, 0);
        painter.save();
        double angle = i * 1.8;  // 计算当前角度
        double radian = qDegreesToRadians(angle);
        // 计算刻度位置（上半圆）
        point.setX(radius * qCos(radian));
        point.setY(-radius * qSin(radian));
        painter.translate(point.x(), point.y());  // 平移到刻度位置
        painter.rotate(90 - angle);  // 旋转刻度使其垂直于半径
        painter.setBrush(QColor(255, 255, 255)); // 白色刻度
        if (i % 5 == 0) {
            painter.drawPath(pointPath_big);  // 每5个小刻度画一个大刻度
        }
        else {
            painter.drawPath(pointPath_small);  // 小刻度
        }
        painter.restore();
    }
}

// 绘制刻度数字（0-100，每10个单位一个）
void SemiCircular::drawNumScale(QPainter& painter, int radius)
{
    painter.setPen(QColor(255, 255, 255));  // 白色数字
    int fontSize = max(8, baseSize * 0.016);  // 动态字体大小（最小8号）
    QFont font;
    font.setFamily("Noto Sans CJK SC Regular");
    font.setPointSize(fontSize);
    font.setBold(true);
    painter.setFont(font);

    // 绘制0、10、20...100数字
    for (int i = 0; i <= 100; i += 10) {
        QPointF point(0, 0);
        painter.save();
        double angle = 180 - i * 1.8;  // 计算数字位置角度
        double radian = qDegreesToRadians(angle);
        point.setX(radius * qCos(radian));
        point.setY(-radius * qSin(radian));  // 上半圆位置
        painter.translate(point.x(), point.y());  // 平移到数字位置
        painter.rotate(-angle);  // 数字垂直显示
        painter.drawText(-30, 0, 50, 15, Qt::AlignCenter, QString::number(i));  // 绘制数字
        painter.restore();
    }
    painter.setPen(Qt::NoPen);
}

// 绘制实时温度数据
void SemiCircular::drawRealTimeData(QPainter& painter, int radius)
{
    painter.save();
    painter.setPen(QColor(255, 255, 255));  // 白色文字
    int fontSize = max(8, baseSize * 0.032);  // 动态字体大小（突出显示）
    QFont font;
    font.setFamily("Noto Sans CJK SC Regular");
    font.setPointSize(fontSize);
    font.setBold(true);
    painter.setFont(font);
    QString displayText = QString::number(value) + " ℃";  // 温度+单位
    painter.drawText(-75, -radius - 80, 150, 100, Qt::AlignCenter, displayText);  // 居中显示
    painter.restore();
}

// 绘制指针（指示当前温度）
void SemiCircular::drawPointer(QPainter& painter, int baseSize)
{
    int radius = baseSize / 2;
    // 指针尺寸比例因子（基于半径）
    double pointerTip = 1.8;
    double pointerBaseWidth = 0.04;
    double pointerBaseLength = 0.001;
    double pointerSideLength = 0.001;

    QPainterPath pointPath;
    pointPath.moveTo(0, -radius * pointerTip);  // 指针尖端
    pointPath.lineTo(radius * pointerBaseWidth, -radius + radius * pointerBaseLength);  // 指针右侧
    pointPath.lineTo(radius * pointerSideLength, -radius * pointerSideLength);
    pointPath.lineTo(-radius * pointerBaseWidth, -radius + radius * pointerBaseLength);  // 指针左侧
    pointPath.closeSubpath();  // 封闭路径

    painter.save();
    painter.rotate(degRotate - 90);  // 指针旋转到对应角度（-90校准起始位置）
    painter.setBrush(QColor(255, 34, 54));  // 红色指针（醒目）
    painter.drawPath(pointPath);  // 绘制指针
    painter.restore();
}

// 重绘事件：整合所有绘制函数，绘制完整仪表盘
void SemiCircular::paintEvent(QPaintEvent*)
{
    QPainter painter(this);
    int width = this->width();
    int height = this->height() - 100;  // 预留底部文字空间
    baseSize = std::min(width, height);
    const int minRadius = 50;
    int radius = std::max(minRadius, baseSize / 2);  // 仪表盘半径（最小50）

    painter.translate(width / 2, height * 0.6);  // 平移原点到仪表盘中心下方
    painter.setRenderHint(QPainter::Antialiasing, true);  // 开启抗锯齿
    painter.setPen(Qt::NoPen);  // 无轮廓线

    // 逐层绘制仪表盘
    drawCircle(painter, radius - baseSize * 0.0375);  // 渐变外扇形
    drawGradientArea(painter, radius - baseSize * 0.05);  // 动态渐变区域
    drawOutMiddleCircle(painter, radius - baseSize * 0.025);  // 外中圆
    drawScale(painter, radius - baseSize * 0.1);  // 刻度线
    drawNumScale(painter, radius - baseSize * 0.125);  // 刻度数字
    drawOutermostLine(painter, radius - baseSize * 0.04375);  // 最外细圆线
    drawMiddleBiggestCircle(painter, radius - baseSize * 0.2175);  // 中间大圆
    drawMiddleCircle(painter, radius - baseSize * 0.22625);  // 中间圆
    drawPointer(painter, radius - baseSize * 0.1625);  // 温度指针
    drawMiddleLittleCircle(painter, radius - baseSize * 0.235);  // 中间小圆
    drawRealTimeData(painter, radius - baseSize * 0.50375);  // 实时温度文字
}