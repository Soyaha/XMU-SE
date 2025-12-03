#include "cone.h"

double Cone::volume() const  { return (1.0 / 3.0) * PI * r * r * h; }

double Cone::area() const { return PI * r * r + PI * r * sh; }