#include "polygon.h"

double Polygon:: perimeter() const { return n * s; }

double Polygon:: area() const
{
    double x = n * s * s;
    double y = 4.0 * tan(PI / n);
    return x / y;
}