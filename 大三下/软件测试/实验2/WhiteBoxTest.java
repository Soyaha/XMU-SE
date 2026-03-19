package whitebox;

import java.util.Scanner;

public class WhiteBoxTest {
    public static void main(String[] args) {
        testFunction1();
        testFunction2();
    }

    public static void testFunction1() {
        System.out.println("--- 任务一: function1 逻辑覆盖测试 ---");
        
        // 语句覆盖 & 路径覆盖 & 条件组合覆盖的部分
        int[][] inputs = {
            {95, 95}, // 满足 (x>=90, y>=90) -> A
            {85, 85}, // 满足 (x+y>=165) -> B (85+85=170)
            {80, 80}  // 不满足 (x+y>=165) -> C (80+80=160)
        };
        
        for (int[] input : inputs) {
            char result = WhiteBox.function1(input[0], input[1]);
            System.out.printf("输入: x=%d, y=%d -> 结果: %c\n", input[0], input[1], result);
        }

        // 为了覆盖特定条件组合 (例如 x>=90, y<90)
        System.out.println("补充条件组合测试:");
        int[][] extra = {
            {95, 80}, // x>=90, y<90, x+y=175 -> B
            {80, 95}  // x<90, y>=90, x+y=175 -> B
        };
        for (int[] input : extra) {
            char result = WhiteBox.function1(input[0], input[1]);
            System.out.printf("输入: x=%d, y=%d -> 结果: %c\n", input[0], input[1], result);
        }
    }

    public static void testFunction2() {
        System.out.println("\n--- 任务二: function2 基本路径测试 ---");
        int[] testData = {1, 2, 6, 150}; // 覆盖基本路径
        for (int n : testData) {
            System.out.print("输入: n=" + n + " -> 输出: ");
            WhiteBox.function2(n);
        }
    }
}
