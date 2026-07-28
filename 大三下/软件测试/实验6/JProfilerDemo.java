import java.util.ArrayList;
import java.util.List;

public class JProfilerDemo {
    private static final List<byte[]> leakList = new ArrayList<>();
    private static final Object LOCK = new Object();

    public static void main(String[] args) {
        Thread leakThread = new Thread(JProfilerDemo::memoryLeakDemo, "Leak-Thread");
        Thread blockThread1 = new Thread(JProfilerDemo::blockedDemo, "Block-Thread-1");
        Thread blockThread2 = new Thread(JProfilerDemo::blockedDemo, "Block-Thread-2");
        Thread cpuThread = new Thread(JProfilerDemo::cpuHotspotDemo, "CPU-Thread");

        leakThread.start();
        blockThread1.start();
        blockThread2.start();
        cpuThread.start();
    }

    private static void memoryLeakDemo() {
        while (true) {
            leakList.add(new byte[1024 * 1024]);
            sleep(200);
        }
    }

    private static void blockedDemo() {
        synchronized (LOCK) {
            sleep(5000);
        }
    }

    private static void cpuHotspotDemo() {
        long sum = 0;
        while (true) {
            for (int i = 0; i < 5_000_000; i++) {
                sum += heavyCalc(i);
            }
            if (sum == Long.MIN_VALUE) {
                System.out.println(sum);
            }
        }
    }

    private static long heavyCalc(int value) {
        long result = value;
        for (int i = 0; i < 200; i++) {
            result = result * 31 + i;
        }
        return result;
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}