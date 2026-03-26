package lab2;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class PublisherClient {
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public static void main(String[] args) throws Exception {
        if (args.length < 4) {
            System.out.println("Usage: PublisherClient <host> <port> <topic> <message1> [message2] ...");
            return;
        }

        String host = args[0];
        int port = Integer.parseInt(args[1]);
        String topic = args[2];

        try (Socket socket = new Socket(host, port);
             BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
             PrintWriter writer = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8), true)) {

            for (int i = 3; i < args.length; i++) {
                String message = args[i];
                writer.println("PUBLISH " + topic + " " + message);
                System.out.println(prefix(topic) + reader.readLine());
                Thread.sleep(200);
            }
        }
    }

    private static String prefix(String topic) {
        return "[" + LocalTime.now().format(TIME_FORMATTER) + "] [Publisher-" + topic + "] ";
    }
}