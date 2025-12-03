import java.util.*;
import java.text.DecimalFormat;

/**
 * 进程类：封装进程属性与计算逻辑
 */
class Process {
    String id;          // 进程ID（如A、B、C）
    int arrivalTime;    // 到达时间
    int serviceTime;    // 总服务时间
    int remainingTime;  // 剩余服务时间（用于抢占式算法）
    int finishTime;     // 完成时间
    int turnaroundTime; // 周转时间 = 完成时间 - 到达时间
    double responseRatio; // 响应比 = 周转时间 / 服务时间

    // 构造方法：初始化进程基础信息
    public Process(String id, int arrivalTime, int serviceTime) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.serviceTime = serviceTime;
        this.remainingTime = serviceTime; // 初始剩余时间 = 总服务时间
        this.finishTime = 0;
        this.turnaroundTime = 0;
        this.responseRatio = 0.0;
    }

    // 深拷贝构造：避免不同算法修改同一进程对象
    public Process(Process other) {
        this.id = other.id;
        this.arrivalTime = other.arrivalTime;
        this.serviceTime = other.serviceTime;
        this.remainingTime = other.remainingTime;
        this.finishTime = other.finishTime;
        this.turnaroundTime = other.turnaroundTime;
        this.responseRatio = other.responseRatio;
    }

    // 计算周转时间和响应比（完成时间确定后调用）
    public void calculateMetrics() {
        this.turnaroundTime = this.finishTime - this.arrivalTime;
        this.responseRatio = this.turnaroundTime * 1.0 / this.serviceTime;
    }

    // 格式化输出进程信息
    @Override
    public String toString() {
        DecimalFormat df = new DecimalFormat("#.00"); // 保留两位小数
        return String.format("进程%s | 到达时间：%d | 服务时间：%d | 完成时间：%d | 周转时间：%d | 响应比：%s",
                id, arrivalTime, serviceTime, finishTime, turnaroundTime, df.format(responseRatio));
    }
}

/**
 * 调度器类：实现五种进程调度算法
 */
class Scheduler {
    private static final DecimalFormat df = new DecimalFormat("#.00"); // 格式化工具

    /**
     * 1. 先来先服务（FCFS）：按到达时间顺序执行
     * @param originalProcesses 原始进程列表
     * @return 计算完成的进程列表
     */
    public static List<Process> fcfs(List<Process> originalProcesses) {
        List<Process> processes = copyProcesses(originalProcesses); // 深拷贝
        int currentTime = 0;

        // 按到达时间排序（未到达的进程后续处理）
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        for (Process p : processes) {
            // 若当前时间早于进程到达时间，直接跳转到到达时间
            if (currentTime < p.arrivalTime) {
                currentTime = p.arrivalTime;
            }
            // 执行进程至完成
            p.finishTime = currentTime + p.serviceTime;
            p.calculateMetrics(); // 计算周转时间和响应比
            currentTime = p.finishTime; // 更新当前时间
        }
        return processes;
    }

    /**
     * 2. 轮转调度（RR）：时间片 q=1
     * @param originalProcesses 原始进程列表
     * @return 计算完成的进程列表
     */
    public static List<Process> rr(List<Process> originalProcesses) {
        List<Process> processes = copyProcesses(originalProcesses);
        Queue<Process> readyQueue = new LinkedList<>(); // 就绪队列
        int currentTime = 0;
        int completed = 0; // 已完成进程数
        Set<String> inQueue = new HashSet<>(); // 避免进程重复加入队列

        while (completed < processes.size()) {
            // 1. 将当前时间到达的进程加入就绪队列
            for (Process p : processes) {
                if (p.arrivalTime == currentTime && !inQueue.contains(p.id) && p.remainingTime > 0) {
                    readyQueue.offer(p);
                    inQueue.add(p.id);
                }
            }

            // 2. 执行就绪队列中的进程（1个时间片）
            if (!readyQueue.isEmpty()) {
                Process currentP = readyQueue.poll();
                inQueue.remove(currentP.id); // 暂时移除队列标记

                currentP.remainingTime--; // 执行1个时间片
                currentTime++; // 时间推进1单位

                // 若进程完成，计算指标；否则重新加入队列
                if (currentP.remainingTime == 0) {
                    currentP.finishTime = currentTime;
                    currentP.calculateMetrics();
                    completed++;
                } else {
                    readyQueue.offer(currentP);
                    inQueue.add(currentP.id); // 重新标记为在队列中
                }
            } else {
                // 就绪队列为空，时间推进
                currentTime++;
            }
        }
        return processes;
    }

    /**
     * 3. 最短进程优先（SPN）：非抢占式，选服务时间最短的已到达进程
     * @param originalProcesses 原始进程列表
     * @return 计算完成的进程列表
     */
    public static List<Process> spn(List<Process> originalProcesses) {
        List<Process> processes = copyProcesses(originalProcesses);
        int currentTime = 0;
        int completed = 0;

        while (completed < processes.size()) {
            // 1. 筛选已到达且未完成的进程
            List<Process> available = new ArrayList<>();
            for (Process p : processes) {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0) {
                    available.add(p);
                }
            }

            if (!available.isEmpty()) {
                // 2. 选择服务时间最短的进程（相同则选到达早的）
                Process selected = available.stream()
                        .min(Comparator.comparingInt((Process p) -> p.serviceTime)
                                .thenComparingInt(p -> p.arrivalTime))
                        .get();

                // 3. 执行至完成
                selected.finishTime = currentTime + selected.serviceTime;
                selected.calculateMetrics();
                currentTime = selected.finishTime;
                selected.remainingTime = 0; // 标记为完成
                completed++;
            } else {
                // 无可用进程，时间推进
                currentTime++;
            }
        }
        return processes;
    }

    /**
     * 4. 最短剩余时间（SRT）：抢占式，选剩余服务时间最短的已到达进程
     * @param originalProcesses 原始进程列表
     * @return 计算完成的进程列表
     */
    public static List<Process> srt(List<Process> originalProcesses) {
        List<Process> processes = copyProcesses(originalProcesses);
        int currentTime = 0;
        int completed = 0;

        while (completed < processes.size()) {
            // 1. 筛选已到达且未完成的进程
            List<Process> available = new ArrayList<>();
            for (Process p : processes) {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0) {
                    available.add(p);
                }
            }

            if (!available.isEmpty()) {
                // 2. 选择剩余服务时间最短的进程（相同则选到达早的）
                Process selected = available.stream()
                        .min(Comparator.comparingInt((Process p) -> p.remainingTime)
                                .thenComparingInt(p -> p.arrivalTime))
                        .get();

                // 3. 执行1个时间片（抢占式需逐单位推进）
                selected.remainingTime--;
                currentTime++;

                // 4. 若进程完成，计算指标
                if (selected.remainingTime == 0) {
                    selected.finishTime = currentTime;
                    selected.calculateMetrics();
                    completed++;
                }
            } else {
                // 无可用进程，时间推进
                currentTime++;
            }
        }
        return processes;
    }

    /**
     * 5. 最高响应比优先（HRRN）：非抢占式，选响应比最高的已到达进程
     * 响应比 = (等待时间 + 服务时间) / 服务时间 = 1 + 等待时间/服务时间
     * @param originalProcesses 原始进程列表
     * @return 计算完成的进程列表
     */
    public static List<Process> hrrn(List<Process> originalProcesses) {
        List<Process> processes = copyProcesses(originalProcesses);
        int currentTime = 0;
        int completed = 0;
        while (completed < processes.size()) {
            // 1. 筛选已到达且未完成的进程
            List<Process> available = new ArrayList<>();
            for (Process p : processes) {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0) {
                    available.add(p);
                }
            }
            if (!available.isEmpty()) {
                // 2. 计算每个可用进程的响应比，选择最高的（相同则选到达早的）
                Process selected = null;
                double maxRatio = -1.0;
                for (Process p : available) {
                    int waitingTime = currentTime - p.arrivalTime;
                    double ratio = 1.0 + (waitingTime * 1.0 / p.serviceTime);
                    // 比较响应比（保留两位小数避免精度问题）
                    if (Math.round(ratio * 100) / 100.0 > maxRatio) {
                        maxRatio = ratio;
                        selected = p;
                    } else if (Math.round(ratio * 100) / 100.0 == maxRatio) {
                        // 响应比相同，选到达时间早的
                        if (p.arrivalTime < selected.arrivalTime) {
                            selected = p;
                        }
                    }
                }
                // 3. 执行选中进程至完成
                selected.finishTime = currentTime + selected.serviceTime;
                selected.calculateMetrics();
                currentTime = selected.finishTime;
                selected.remainingTime = 0; // 标记为完成
                completed++;
            } else {
                // 无可用进程，时间推进
                currentTime++;
            }
        }
        return processes;
    }

    /**
     * 深拷贝进程列表：避免不同算法修改同一对象
     */
    private static List<Process> copyProcesses(List<Process> original) {
        List<Process> copy = new ArrayList<>();
        for (Process p : original) {
            copy.add(new Process(p));
        }
        return copy;
    }

    /**
     * 计算平均周转时间
     */
    public static double calculateAvgTurnaroundTime(List<Process> processes) {
        int total = 0;
        for (Process p : processes) {
            total += p.turnaroundTime;
        }
        return total * 1.0 / processes.size();
    }

    /**
     * 打印调度结果
     */
    public static void printResult(String algorithmName, List<Process> processes) {
        System.out.println("==================================== " + algorithmName + " 调度结果 ====================================");
        for (Process p : processes) {
            System.out.println(p);
        }
        System.out.println("平均周转时间：" + df.format(calculateAvgTurnaroundTime(processes)) + "\n");
    }
}

/**
 * 主类：测试五种调度算法
 */
public class ProcessSchedulingTest {
    public static void main(String[] args) {
        // 初始化实验中的进程数据（进程ID、到达时间、服务时间）
/*        List<Process> originalProcesses = Arrays.asList(
                new Process("A", 0, 3),
                new Process("B", 2, 6),
                new Process("C", 4, 4),
                new Process("D", 6, 5),
                new Process("E", 8, 2)
        );*/
/*        List<Process> originalProcesses = Arrays.asList(
                new Process("A", 0, 4),
                new Process("B", 2, 6),
                new Process("C", 4, 3),
                new Process("D", 6, 5),
                new Process("E", 8, 2),
                new Process("F", 10, 7)
        );*/
/*        List<Process> originalProcesses = Arrays.asList(
                new Process("A", 0, 10),
                new Process("B", 1, 8),
                new Process("C", 5, 1),
                new Process("D", 6, 2),
                new Process("E", 7, 1),
                new Process("F", 8, 3)
        );*/
/*        List<Process> originalProcesses = Arrays.asList(
                new Process("A", 0, 5),
                new Process("B", 0, 3),
                new Process("C", 0, 8),
                new Process("D", 0, 2),
                new Process("E", 0, 6)
        );*/
/*        List<Process> originalProcesses = Arrays.asList(
                new Process("A", 0, 20),
                new Process("B", 1, 1),
                new Process("C", 2, 1),
                new Process("D", 3, 1),
                new Process("E", 4, 1),
                new Process("F", 5, 1),
                new Process("G", 6, 1)
        );*/
        List<Process> originalProcesses = Arrays.asList(
                new Process("A", 0, 7),
                new Process("B", 3, 4),
                new Process("C", 5, 9),
                new Process("D", 8, 2),
                new Process("E", 10, 5),
                new Process("F", 12, 3),
                new Process("G", 15, 6),
                new Process("H", 18, 1)
        );

        // 执行五种调度算法并输出结果
        List<Process> fcfsResult = Scheduler.fcfs(originalProcesses);
        Scheduler.printResult("先来先服务（FCFS）", fcfsResult);

        List<Process> rrResult = Scheduler.rr(originalProcesses);
        Scheduler.printResult("轮转调度（RR，q=1）", rrResult);

        List<Process> spnResult = Scheduler.spn(originalProcesses);
        Scheduler.printResult("最短进程优先（SPN）", spnResult);

        List<Process> srtResult = Scheduler.srt(originalProcesses);
        Scheduler.printResult("最短剩余时间（SRT）", srtResult);

        List<Process> hrrnResult = Scheduler.hrrn(originalProcesses);
        Scheduler.printResult("最高响应比优先（HRRN）", hrrnResult);
    }
}