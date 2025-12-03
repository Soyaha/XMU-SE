#ifndef CIRCLE_H
#define CIRCLE_H
#include<cmath>
#include "shape.h"

class Circle : public Shape2D
{
private:
    double r;
public:
    Circle(double r) : r(r) {}
    double perimeter() const override;
    double area() const override;
};

#endif