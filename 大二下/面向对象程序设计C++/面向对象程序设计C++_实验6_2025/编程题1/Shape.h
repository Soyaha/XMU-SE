#ifndef SHAPE_H
#define SHAPE_H
class Shape
{
public:
    virtual double getArea() = 0;
    virtual ~Shape() {}
};

class Rectangle : public Shape
{
private:
    int h, w;
public:
    Rectangle(int w = 0, int h = 0) : w(w), h(h) {}
    double getArea() override;
    ~Rectangle() {}
};

class Circle : public Shape
{
private:
    double r;
public:
    Circle(double r = 0) : r(r) {}
    double getArea() override;
    ~Circle() {}
};
#endif 