#include "numkey.h"

// 构造函数：初始化0-9数字按钮
numKey::numKey(QWidget* parent) : QWidget(parent)
{
    // 反向循环（9→0）创建按钮，便于后续布局
    for (int i = 9; i >= 0; i--) {
        // 创建按钮，显示文本为数字i
        buttons[i] = new QPushButton(QString::number(i), this);
        // 设置按钮样式：深色背景、无边框、圆角、hover/pressed状态变色
        buttons[i]->setStyleSheet("QPushButton {"
            "background-color: #444444;"
            "border: none;"
            "color: white;"
            "padding: 10px;"
            "border-radius: 5px;"
            "outline: none;"
            "}"
            "QPushButton:hover {"
            "background-color: #555555;"
            "outline: none;"
            "}"
            "QPushButton:pressed {"
            "background-color: #666666;"
            "outline: none;"
            "}");
        buttons[i]->setFixedHeight(80);  // 固定按钮高度
        QFont buttonsfont("Noto Sans CJK SC Regular", 20);  // 设置字体大小
        buttons[i]->setFont(buttonsfont);
    }
}

// 获取指定索引的数字按钮（0-9）
QPushButton* numKey::getButton(int index) {
    if (index >= 0 && index < 10) {  // 检查索引有效性（0-9）
        return buttons[index];  // 返回对应按钮对象
    }
    return nullptr;  // 索引无效时返回空指针
}