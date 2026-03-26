package lab2;

public class DemoMain {
    public static void main(String[] args) throws Exception {
        int port = 19092;
        TopicBroker broker = new TopicBroker(port);
        broker.start();

        Thread sub1 = new Thread(() -> runSubscriber(port, "news", "Alice", 3), "sub-alice");
        Thread sub2 = new Thread(() -> runSubscriber(port, "news", "Bob", 3), "sub-bob");
        Thread sub3 = new Thread(() -> runSubscriber(port, "news", "Cindy", 3), "sub-cindy");

        sub1.start();
        sub2.start();
        sub3.start();

        Thread.sleep(800);

        Thread publisher = new Thread(() -> runPublisher(port, "news",
                "Hello topic!",
                "This is a broadcast message.",
                "Every subscriber will receive it."), "publisher");
        publisher.start();
        publisher.join();

        sub1.join();
        sub2.join();
        sub3.join();

        Thread.sleep(1000);
        broker.close();
    }

    private static void runSubscriber(int port, String topic, String subscriberName, int maxMessages) {
        try {
            SubscriberClient.main(new String[]{"127.0.0.1", String.valueOf(port), topic, subscriberName, String.valueOf(maxMessages)});
        } catch (Exception e) {
            System.out.println("Subscriber " + subscriberName + " failed: " + e.getMessage());
        }
    }

    private static void runPublisher(int port, String topic, String... messages) {
        try {
            String[] args = new String[3 + messages.length];
            args[0] = "127.0.0.1";
            args[1] = String.valueOf(port);
            args[2] = topic;
            System.arraycopy(messages, 0, args, 3, messages.length);
            PublisherClient.main(args);
        } catch (Exception e) {
            System.out.println("Publisher failed: " + e.getMessage());
        }
    }
}