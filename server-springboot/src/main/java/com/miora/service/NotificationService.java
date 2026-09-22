package com.miora.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.miora.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Sends push notifications via Firebase Cloud Messaging (FCM).
 *
 * Requires:
 *  1. A real Firebase service account JSON at the path configured by
 *     `firebase.service-account-path` (see application.properties) — without it,
 *     firebaseMessaging() in FirebaseConfig returns null and this service becomes a safe no-op.
 *  2. The client to have registered a device token via PUT /api/user/me { "fcmToken": "..." }
 *     (see client/src/services/notificationService.ts).
 *
 * This is intentionally defensive: a missing token, missing credentials, or an FCM error
 * never throws up into the calling business logic (a chat message / match should still
 * succeed even if the push notification fails to send).
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final FirebaseMessaging firebaseMessaging;
    private final FirestoreService firestoreService;

    public NotificationService(FirebaseMessaging firebaseMessaging, FirestoreService firestoreService) {
        this.firebaseMessaging = firebaseMessaging;
        this.firestoreService = firestoreService;
    }

    public boolean isConfigured() {
        return firebaseMessaging != null;
    }

    /**
     * Sends a push notification to a specific user by looking up their stored fcmToken.
     * Returns true only if a message was actually dispatched to FCM.
     */
    public boolean sendToUser(String userId, String title, String body, Map<String, String> data) {
        if (userId == null) return false;
        User user = firestoreService.getUser(userId);
        if (user == null || user.getFcmToken() == null || user.getFcmToken().trim().isEmpty()) {
            log.debug("No FCM token on file for user {}, skipping push notification.", userId);
            return false;
        }
        return sendToToken(user.getFcmToken(), title, body, data);
    }

    /**
     * Sends a push notification directly to a device token.
     */
    public boolean sendToToken(String fcmToken, String title, String body, Map<String, String> data) {
        if (firebaseMessaging == null) {
            log.warn("FirebaseMessaging is not configured (no service account credentials) — skipping push send.");
            return false;
        }
        if (fcmToken == null || fcmToken.trim().isEmpty()) {
            return false;
        }
        try {
            Message.Builder builder = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());
            if (data != null) {
                builder.putAllData(data);
            }
            String response = firebaseMessaging.send(builder.build());
            log.info("Push notification sent: {}", response);
            return true;
        } catch (FirebaseMessagingException e) {
            log.warn("Failed to send push notification: {}", e.getMessage());
            return false;
        }
    }
}
