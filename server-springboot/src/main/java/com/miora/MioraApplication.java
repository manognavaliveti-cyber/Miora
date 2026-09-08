package com.miora;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class MioraApplication {

    private static final Logger log = LoggerFactory.getLogger(MioraApplication.class);

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:}")
    private String razorpayKeySecret;

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(MioraApplication.class, args);
    }

    @PostConstruct
    public void verifyStartupConfig() {
        boolean keyIdPresent = razorpayKeyId != null && !razorpayKeyId.trim().isEmpty();
        boolean secretPresent = razorpayKeySecret != null && !razorpayKeySecret.trim().isEmpty();

        if (keyIdPresent && secretPresent) {
            log.info("Razorpay credentials loaded successfully (Test mode active, secrets protected)");
        } else {
            log.warn("Razorpay credentials check: Key ID present = {}, Key Secret present = {}", keyIdPresent, secretPresent);
        }
    }

    /**
     * Safely loads local environment variables from .env file for development.
     * System environment variables and existing system properties always take precedence.
     */
    private static void loadDotEnv() {
        File[] possibleFiles = new File[]{
            new File(".env"),
            new File("server-springboot/.env"),
            new File("../server-springboot/.env")
        };

        for (File envFile : possibleFiles) {
            if (envFile.exists() && envFile.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null && !value.isEmpty()) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    log.info("Securely loaded local environment configuration from: {}", envFile.getPath());
                    break;
                } catch (IOException e) {
                    log.warn("Could not read local .env file: {}", e.getMessage());
                }
            }
        }
    }
}
