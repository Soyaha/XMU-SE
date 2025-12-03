#ifndef COMPLEX_H_
#define COMPLEX_H_
#include <iostream>
#include <cmath>
#include <iomanip>
#include <sstream>

using std::ostream;
using std::sqrt;
using std::fixed;
using std::setprecision;
using std::stringstream;

class Complex {
public:
    double Re, Im;

    Complex(double re = 0.0, double im = 0.0) : Re(re), Im(im) {}
    Complex(double d) : Re(d), Im(0.0) {}
    Complex operator~() const { return Complex(Re, -Im); }
    Complex operator-() const { return Complex(-Re, -Im); }

    friend ostream& operator<<(ostream& os, const Complex& c);
};

Complex operator+(const Complex& c1, const Complex& c2) {
    return Complex(c1.Re + c2.Re, c1.Im + c2.Im);
}
Complex operator+(double d, Complex c) {
    Complex d1(d, 0);
    return Complex(d1.Re + c.Re, c.Im);
}
Complex operator+(Complex c, int d) { return c + static_cast<double>(d); }
Complex operator+(const int& d, Complex c) { return static_cast<double>(d) + c; }
Complex operator+(Complex c, double d) { return Complex(c.Re + d, c.Im); }
Complex operator-(Complex c1, Complex c2) {
    return Complex(c1.Re - c2.Re, c1.Im - c2.Im);
}

Complex operator*(Complex c1, Complex c2) {
    return Complex(
        c1.Re * c2.Re - c1.Im * c2.Im,
        c1.Re * c2.Im + c1.Im * c2.Re
    );
}

Complex operator/(Complex c1, Complex c2) {
    double denom = c2.Re * c2.Re + c2.Im * c2.Im;
    return Complex(
        (c1.Re * c2.Re + c1.Im * c2.Im) / denom,
        (c1.Im * c2.Re - c1.Re * c2.Im) / denom
    );
}

Complex abs(const Complex& c) {
    return Complex(sqrt(c.Re * c.Re + c.Im * c.Im), 0);
}

Complex operator""i(unsigned long long im) {
    return Complex(0.0, static_cast<double>(im));
}

Complex operator""i(long double im) {
    return Complex(0.0, static_cast<double>(im));
}

ostream& operator<<(ostream& os, const Complex& c) {
    const double eps = 1e-5;
    bool reZero = fabs(c.Re) < eps, imZero = fabs(c.Im) < eps;
    stringstream ss;
    ss << fixed << setprecision(2);

    if (reZero && imZero) {
        ss << "0.00";
    }
    else {
        if (!reZero) {
            ss << c.Re;
        }
        if (!imZero) {
            double im = c.Im;
            std::string sign = (im > 0) ? " + " : " - ";
            double absIm = fabs(im);
            if (reZero) {
                ss << absIm << "i";
            }
            else {
                ss << sign << absIm << "i";
            }
        }
    }

    std::string output = ss.str();
    if (output == "-0.00") {
        output = "0.00";
    }
    os << output;
    return os;
}
#endif