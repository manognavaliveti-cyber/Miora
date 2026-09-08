package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.model.User;
import com.miora.security.SecurityUtils;
import com.miora.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private FirestoreService firestoreService;

    @PostMapping("/subscription/subscribe")
    public ResponseEntity<ApiResponse<User>> subscribe(@RequestBody(required = false) Map<String, String> payload) {
        String userId = SecurityUtils.getCurrentUserId();
        String planId = (payload != null && payload.get("planId") != null) ? payload.get("planId") : "monthly";
        String paymentMethod = (payload != null && payload.get("paymentMethod") != null) ? payload.get("paymentMethod") : "inr";
        User updated = firestoreService.subscribeUser(userId, planId, paymentMethod);
        return ResponseEntity.ok(ApiResponse.ok("Subscribed to " + planId + " successfully", updated));
    }

    @PostMapping("/powerups/boost")
    public ResponseEntity<ApiResponse<User>> activateBoost() {
        String userId = SecurityUtils.getCurrentUserId();
        User updated = firestoreService.boostUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("30-minute Boost activated", updated));
    }

    @PostMapping("/powerups/spotlight")
    public ResponseEntity<ApiResponse<User>> activateSpotlight() {
        String userId = SecurityUtils.getCurrentUserId();
        User updated = firestoreService.spotlightUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("24-hour Spotlight activated", updated));
    }

    @GetMapping("/likes/who-liked-me")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWhoLikedMe() {
        String userId = SecurityUtils.getCurrentUserId();
        List<Map<String, Object>> admirers = firestoreService.getWhoLikedMe(userId);
        return ResponseEntity.ok(ApiResponse.ok("Fetched admirers successfully", admirers));
    }
}
