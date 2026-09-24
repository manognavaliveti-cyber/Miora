package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String name;
    private String email;
    private Integer age;
    private String dateOfBirth;
    private String gender; // woman, man, non-binary, prefer-not-to-say
    private String location;
    private String bio;
    @Builder.Default
    private List<String> photos = new ArrayList<>();
    @Builder.Default
    private List<String> interests = new ArrayList<>();
    @Builder.Default
    private Integer profileCompletion = 85;
    @Builder.Default
    private UserPreferences preferences = new UserPreferences();
    private String occupation;
    private String education;
    private String relationshipIntent; // Long-term, Marriage, Casual dating, New friends, Open to anything
    @Builder.Default
    private Map<String, String> lifestyle = new HashMap<>();
    @Builder.Default
    private Double walletBalance = 0.0;
    @Builder.Default
    private Integer coinBalance = 0;
    @Builder.Default
    private Integer talkTimeSecondsRemaining = 420;
    @Builder.Default
    private Map<String, Integer> receivedGifts = new HashMap<>();
    @Builder.Default
    private Integer gamesWonCount = 4;
    
    // Monetization & Subscription Tiers (FREE, PRO, VIP)
    @Builder.Default
    private Boolean isPremium = false;
    @Builder.Default
    private String subscriptionTier = "free"; // free, pro, vip
    private String subscriptionPlanId; // pro, vip
    private String subscriptionExpiresAt;

    // Account status & Admin control fields
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED, BANNED, DELETION_PENDING, DELETED
    @Builder.Default
    private Boolean suspended = false;
    @Builder.Default
    private Boolean banned = false;
    @Builder.Default
    private Boolean deleted = false;
    @Builder.Default
    private Boolean warned = false;
    private String warningReason;
    private String createdAt;
    private String updatedAt;

    // Daily Usage Limits & Tracking (Backend Authoritative)
    @Builder.Default
    private Integer dailySwipesRemaining = 10;
    @Builder.Default
    private Integer dailySwipesMax = 10;
    @Builder.Default
    private Integer dailyLikesRemaining = 10;
    @Builder.Default
    private Integer dailyLikesMax = 10;
    @Builder.Default
    private Integer dailyMessagesRemaining = 500;
    @Builder.Default
    private Integer dailyMessagesMax = 500;
    @Builder.Default
    private Integer dailyAudioCallsRemaining = 10;
    @Builder.Default
    private Integer dailyAudioCallsMax = 10;
    @Builder.Default
    private Integer dailyVideoCallsRemaining = 3;
    @Builder.Default
    private Integer dailyVideoCallsMax = 3;
    private String lastDailyResetDate;
    @Builder.Default
    private Integer superLikesRemaining = 1;

    // Power-Ups Inventory & Timers
    @Builder.Default
    private Integer boostsCount = 1;
    @Builder.Default
    private Integer spotlightsCount = 0;
    private String boostActiveUntil;
    private String spotlightActiveUntil;

    @Builder.Default
    private Boolean termsAccepted = true;
    @Builder.Default
    private String termsVersion = "1.0";
    private String termsAcceptedAt;

    // Push Notifications: Firebase Cloud Messaging device token (set by client after permission grant)
    private String fcmToken;

    // Fields written by the realtimeUsers service to Firestore — declared here so
    // Firestore's CustomClassMapper doesn't emit WARN on deserialization.
    private String lastActiveAt;
    private Boolean online;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserPreferences {
        @Builder.Default
        private String interestedIn = "everyone"; // women, men, everyone
        @Builder.Default
        private AgeRange ageRange = new AgeRange(21, 35);
        @Builder.Default
        private Integer maxDistanceKm = 50;
        @Builder.Default
        private String location = "Downtown Metropolis";
        @Builder.Default
        private String allowAudioCalls = "matches"; // all, matches, nobody
        @Builder.Default
        private String allowVideoCalls = "matches"; // all, matches, nobody
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgeRange {
        @Builder.Default
        private Integer min = 21;
        @Builder.Default
        private Integer max = 35;
    }
}
