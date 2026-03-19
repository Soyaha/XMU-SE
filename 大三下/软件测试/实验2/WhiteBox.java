package whitebox;

import java.util.Scanner;

public class WhiteBox {
    public static char function1(int x, int y) {
        char c;
        if ((x >= 90) && (y >= 90)) {
            c = 'A';
        } else {
            if ((x + y) >= 165) {
                c = 'B';
            } else {
                c = 'C';
            }
        }
        return c;
    }

    public static void function2(int n) {
        int k = 2;
        System.out.print(n + "=");
        while (k <= n) {
            if (k == n) {
                System.out.println(n);
                break;
            } else {
                if (n % k == 0) {
                    System.out.print(k + "*");
                    n = n / k;
                } else {
                    k++;
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner scaner = new Scanner(System.in);
        // 第一题
//        System.out.print("请输入两个正整数分别为x、y：");
//        int x = scaner.nextInt();
//        int y = scaner.nextInt();
//        System.out.println("结果为：" + function1(x, y));
        // 第二题
        System.out.print("请输入n：");
        int n = scaner.nextInt();
        function2(n);
    }
}
