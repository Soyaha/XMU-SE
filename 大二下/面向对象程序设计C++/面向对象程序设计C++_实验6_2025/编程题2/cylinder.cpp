#include "cylinder.h"

double Cylinder:: volume() const { return PI * r * r * h; }

double Cylinder:: area() const { return 2.0 * PI * r * r + 2.0 * PI * r * h; }