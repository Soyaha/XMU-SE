package lab2;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class SubscriberClient {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public static void main(String[] args) throws Exception {
        if (args.length < 4) {
            System.out.println("Usage: SubscriberClient <host> <port> <topic> <subscriberName> [maxMessages]");
            return;
        }

        String host = args[0];
        int port = Integer.parseInt(args[1]);
        String topic = args[2];
        String subscriberName = args[3];
        int maxMessages = args.length >= 5 ? Integer.parseInt(args[4]) : -1;

        try (Socket socket = new Socket(host, port);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
             PrintWriter writer = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true)) {

            writer.println("SUBSCRIBE " + topic + " " + subscriberName);
            System.out.println(prefix(subscriberName) + reader.readLine());

            int receivedMessages = 0;
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(prefix(subscriberName) + line);
                if (line.startsWith("MESSAGE ")) {
                    receivedMessages++;
                    if (maxMessages > 0 && receivedMessages >= maxMessages) {
                        break;
                    }
                }
            }
        }
    }

    private static String prefix(String subscriberName) {
        return "[" + LocalTime.now().format(TIME_FORMATTER) + "] [Subscriber-" + subscriberName + "] ";
    }
}