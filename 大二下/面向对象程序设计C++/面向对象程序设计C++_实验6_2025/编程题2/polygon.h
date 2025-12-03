#ifndef POLYGON_H
#define POLYGON_H
#include<cmath>
#include "shape.h"

class Polygon : public Shape2D
{
private:
    double n, s;
public:
    Polygon(double n, double s) : n(n), s(s) {}
    double perimeter() const override;
    double area() const override;
};

#endif