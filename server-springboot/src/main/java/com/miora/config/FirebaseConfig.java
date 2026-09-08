package com.miora.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.project-id:miora-dating-app}")
    private String projectId;

    @Value("${firebase.service-account-path:firebase-service-account.json}")
    private String serviceAccountPath;

    @Value("${firebase.dev-fallback-enabled:true}")
    private boolean devFallbackEnabled;

    private boolean isFirebaseInitialized = false;

    @Bean
    public FirebaseApp firebaseApp(ResourceLoader resourceLoader) {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        try {
            InputStream serviceAccountStream = null;

            // Check if file exists in filesystem
            File file = new File(serviceAccountPath);
            if (file.exists()) {
                log.info("Loading Firebase credentials from file: {}", file.getAbsolutePath());
                serviceAccountStream = new FileInputStream(file);
            } else {
                // Check classpath
                Resource resource = resourceLoader.getResource("classpath:" + serviceAccountPath);
                if (resource.exists()) {
                    log.info("Loading Firebase credentials from classpath: {}", serviceAccountPath);
                    serviceAccountStream = resource.getInputStream();
                }
            }

            if (serviceAccountStream != null) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                        .setProjectId(projectId)
                        .build();

                FirebaseApp app = FirebaseApp.initializeApp(options);
                isFirebaseInitialized = true;
                log.info("Firebase Admin SDK successfully initialized for project: {}", projectId);
                return app;
            } else if (System.getenv("GOOGLE_APPLICATION_CREDENTIALS") != null) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .setProjectId(projectId)
                        .build();
                FirebaseApp app = FirebaseApp.initializeApp(options);
                isFirebaseInitialized = true;
                log.info("Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS");
                return app;
            } else {
                log.warn("No Firebase service account credentials found at '{}'. Running with Dev Fallback Mode.", serviceAccountPath);
                // Initialize default dummy app for dev mode
                FirebaseOptions options = FirebaseOptions.builder()
                        .setProjectId(projectId)
                        .build();
                return FirebaseApp.initializeApp(options, "miora-dev-app");
            }
        } catch (Exception e) {
            log.warn("Could not initialize live Firebase Admin SDK: {}. Using dev fallback.", e.getMessage());
            return null;
        }
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        try {
            if (firebaseApp != null) {
                return FirebaseAuth.getInstance(firebaseApp);
            }
        } catch (Exception e) {
            log.warn("FirebaseAuth instance unavailable: {}", e.getMessage());
        }
        return null;
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        try {
            if (firebaseApp != null && isFirebaseInitialized) {
                return FirestoreClient.getFirestore(firebaseApp);
            }
        } catch (Exception e) {
            log.warn("FirestoreClient instance unavailable: {}", e.getMessage());
        }
        return null;
    }
}
