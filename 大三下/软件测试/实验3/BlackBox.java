package blackbox;

import java.util.Scanner;

public class BlackBox {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        inquireDate d = new inquireDate();
        // 单个输入
        while (true) {
            System.out.println("请输入1900-2050年任意日期(xxxx年xx月xx日)：");
            d.year = scanner.nextInt();
            d.month = scanner.nextInt();
            d.day = scanner.nextInt();
            if (1900 > d.year || d.year > 2050) {
                System.out.println("年份不符合要求！");
            } else {
                //先判断日期是否合法
                if (d.isLegal()) {
                    d.result();
                    System.out.println("其隔一日日期为：" + d.year + "年" + d.month + "月" + d.day + "日");
                } else System.out.println("该日期不存在！");
            }
            System.out.println();
        }
        //批量输入
//        while (true) {
//            System.out.println("请输入待查询的日期总数：");
//            int count = scanner.nextInt();
//            int[] year = new int[count];
//            int[] month = new int[count];
//            int[] day = new int[count];
//            System.out.println("请输入1900-2050年任意日期(xxxx年xx月xx日)：");
//            for (int i = 0; i < count; i++) {
//                year[i] = scanner.nextInt();
//                month[i] = scanner.nextInt();
//                day[i] = scanner.nextInt();
//            }
//            for (int i = 0; i < count; i++) {
//                d.year = year[i];
//                d.month = month[i];
//                d.day = day[i];
//                if (1900 > year[i] || year[i] > 2050) {
//                    System.out.println(year[i] + "年份不符合要求！");
//                } else {
//                    //先判断日期是否合法
//                    if (d.isLegal()) {
//                        d.result();
//                        System.out.println(year[i] + "年" + month[i] + "月" + day[i] + "日" + "的隔一日日期为：" + d.year + "年" + d.month + "月" + d.day + "日");
//                    } else System.out.println(year[i] + "年" + month[i] + "月" + day[i] + "日" + " 不存在！");
//                }
//            }
//            System.out.println();
//        }
    }
}

class inquireDate {
    public int year, month, day;

    //判断闰年
    public boolean isLeapYear() {
        return (year % 4 == 0 && year % 100 != 0 || year % 400 == 0);
    }

    //判断输入日期是否合法
    public boolean isLegal() {
        if (month != 2) {
            if (month == 4 || month == 6 || month == 9 || month == 11) {
                if (0 < day && day <= 30) return true;
                return false;
            } else {
                if (0 < day && day <= 31 && 0 < month && month <= 12) return true;
                return false;
            }
        } else if (isLeapYear()) {
            if (0 < day && day <= 29) return true;
            return false;
        } else {
            if (0 < day && day <= 28) return true;
            return false;
        }
    }

    //求隔一日日期
    public void result() {
        //非2月情况
        if (month != 2) {
            //小月只有30天
            if (month == 4 || month == 6 || month == 9 || month == 11) {
                if (day == 29) {
                    day = 1;
                    month++;
                } else if (day == 30) {
                    day = 2;
                    month++;
                } else day = day + 2;
            }
            //非12月的大月，有31天
            else if (month != 12) {
                if (day == 30) {
                    day = 1;
                    month++;
                } else if (day == 31) {
                    day = 2;
                    month++;
                } else day = day + 2;
            }
            //12月，涉及跨年
            else {
                if (day == 30) {
                    day = 1;
                    month = 1;
                    year++;
                } else if (day == 31) {
                    day = 2;
                    month = 1;
                    year++;
                } else day = day + 2;
            }
        }
        //2月，分平年、闰年
        else if (isLeapYear()) {
            if (day == 28) {
                day = 1;
                month++;
            } else if (day == 29) {
                day = 2;
                month++;
            } else day = day + 2;
        }
        //平年2月只有28天
        else {
            if (day == 27) {
                day = 1;
                month++;
            } else if (day == 28) {
                day = 2;
                month++;
            } else day = day + 2;
        }
    }
}
