package lab2;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class TopicBroker implements Closeable {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final int port;
    private final Map<String, CopyOnWriteArrayList<SubscriberSession>> subscriptions = new ConcurrentHashMap<>();
    private final ExecutorService clientPool = Executors.newCachedThreadPool();
    private final AtomicBoolean running = new AtomicBoolean(false);

    private ServerSocket serverSocket;
    private Thread acceptThread;

    public TopicBroker(int port) {
        this.port = port;
    }

    public void start() throws IOException {
        if (!running.compareAndSet(false, true)) {
            return;
        }
        serverSocket = new ServerSocket(port);
        acceptThread = new Thread(this::acceptLoop, "topic-broker-accept");
        acceptThread.start();
        log("Broker started on port " + port);
    }

    private void acceptLoop() {
        while (running.get()) {
            try {
                Socket socket = serverSocket.accept();
                clientPool.submit(() -> handleClient(socket));
            } catch (IOException e) {
                if (running.get()) {
                    log("Accept error: " + e.getMessage());
                }
            }
        }
    }

    private void handleClient(Socket socket) {
           try (Socket clientSocket = socket;
               BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream(), StandardCharsets.UTF_8));
               BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(clientSocket.getOutputStream(), StandardCharsets.UTF_8))) {

            String firstLine = reader.readLine();
            if (firstLine == null || firstLine.trim().isEmpty()) {
                return;
            }

            String[] head = firstLine.split(" ", 3);
            String command = head[0].toUpperCase();

            if ("SUBSCRIBE".equals(command)) {
                handleSubscriber(reader, writer, head);
            } else if ("PUBLISH".equals(command)) {
                handlePublisher(reader, writer, firstLine, head);
            } else {
                writer.write("ERROR unsupported command\n");
                writer.flush();
            }
        } catch (IOException e) {
            log("Client closed: " + e.getMessage());
        }
    }

    private void handleSubscriber(BufferedReader reader, BufferedWriter writer, String[] head) throws IOException {
        if (head.length < 3) {
            writer.write("ERROR usage: SUBSCRIBE <topic> <subscriberName>\n");
            writer.flush();
            return;
        }

        String topic = head[1];
        String subscriberName = head[2];
        SubscriberSession session = new SubscriberSession(topic, subscriberName, writer);
        subscriptions.computeIfAbsent(topic, key -> new CopyOnWriteArrayList<>()).add(session);

        writer.write("OK subscribed topic=" + topic + " as " + subscriberName + "\n");
        writer.flush();
        log(subscriberName + " subscribed to topic " + topic);

        while (reader.readLine() != null) {
            // Subscriber保持开放
        }

        removeSubscriber(session);
        log(subscriberName + " disconnected from topic " + topic);
    }

    private void handlePublisher(BufferedReader reader, BufferedWriter writer, String firstLine, String[] head) throws IOException {
        publishLine(writer, head);
        String line;
        while ((line = reader.readLine()) != null) {
            if (!line.trim().isEmpty()) {
                String[] nextHead = line.split(" ", 3);
                publishLine(writer, nextHead);
            }
        }
    }

    private void publishLine(BufferedWriter writer, String[] head) throws IOException {
        if (head.length < 3) {
            writer.write("ERROR usage: PUBLISH <topic> <message>\n");
            writer.flush();
            return;
        }

        String topic = head[1];
        String message = head[2];
        broadcast(topic, message);
        writer.write("OK published topic=" + topic + " message=" + message + "\n");
        writer.flush();
    }

    private void broadcast(String topic, String message) {
        List<SubscriberSession> sessions = subscriptions.get(topic);
        if (sessions == null || sessions.isEmpty()) {
            log("No subscribers for topic " + topic + ", message dropped: " + message);
            return;
        }

        log("Broadcast topic=" + topic + " message=" + message + " to " + sessions.size() + " subscriber(s)");
        for (SubscriberSession session : sessions) {
            try {
                session.send(topic, message);
            } catch (IOException e) {
                removeSubscriber(session);
                log("Removed dead subscriber " + session.subscriberName + " on topic " + topic);
            }
        }
    }

    private void removeSubscriber(SubscriberSession session) {
        List<SubscriberSession> sessions = subscriptions.get(session.topic);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                subscriptions.remove(session.topic, sessions);
            }
        }
    }

    private void log(String message) {
        System.out.println("[" + LocalTime.now().format(TIME_FORMATTER) + "] [Broker] " + message);
    }

    @Override
    public void close() throws IOException {
        running.set(false);
        if (serverSocket != null && !serverSocket.isClosed()) {
            serverSocket.close();
        }
        clientPool.shutdownNow();
        log("Broker stopped");
    }

    public static void main(String[] args) throws Exception {
        int port = args.length > 0 ? Integer.parseInt(args[0]) : 19092;
        TopicBroker broker = new TopicBroker(port);
        broker.start();
        System.out.println("Press Enter to stop broker...");
        System.in.read();
        broker.close();
    }

    private static final class SubscriberSession {
        private final String topic;
        private final String subscriberName;
        private final BufferedWriter writer;

        private SubscriberSession(String topic, String subscriberName, BufferedWriter writer) {
            this.topic = topic;
            this.subscriberName = subscriberName;
            this.writer = writer;
        }

        private synchronized void send(String topic, String message) throws IOException {
            writer.write("MESSAGE topic=" + topic + " subscriber=" + subscriberName + " body=" + message + "\n");
            writer.flush();
        }
    }
}