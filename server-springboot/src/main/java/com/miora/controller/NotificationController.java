package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.security.SecurityUtils;
import com.miora.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Reports whether Firebase Cloud Messaging is configured on this server
     * (i.e. a real service account JSON was found — not just dev-fallback mode).
     * Useful for confirming your deployment/config before wiring up real send calls.
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("configured", notificationService.isConfigured());
        return ResponseEntity.ok(ApiResponse.ok(status));
    }

    /**
     * Sends a test push notification to the currently authenticated user's
     * registered device token. Call this after logging in on a real device/browser
     * with notifications granted, to verify the whole pipeline end-to-end.
     */
    @PostMapping("/test")
    public ResponseEntity<ApiResponse<Boolean>> sendTestNotification() {
        String userId = SecurityUtils.getCurrentUserId();
        boolean sent = notificationService.sendToUser(
                userId,
                "MIORA 💕",
                "This is a test push notification — your setup works!",
                Map.of("type", "test")
        );
        return ResponseEntity.ok(ApiResponse.ok(
                sent ? "Test notification sent." : "Could not send — check /api/notifications/status and that your device has a registered fcmToken.",
                sent
        ));
    }
}
