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
    private Integer coinBalance = 350;
    @Builder.Default
    private Integer talkTimeSecondsRemaining = 420;
    @Builder.Default
    private Map<String, Integer> receivedGifts = new HashMap<>();
    @Builder.Default
    private Integer gamesWonCount = 4;
    
    // Monetization & Subscription Tiers
    @Builder.Default
    private Boolean isPremium = false;
    @Builder.Default
    private String subscriptionTier = "free"; // free, gold, platinum
    private String subscriptionPlanId; // monthly, quarterly, yearly
    private String subscriptionExpiresAt;

    // Admin control fields
    @Builder.Default
    private Boolean suspended = false;
    @Builder.Default
    private Boolean deleted = false;

    // Swipes & Limits
    @Builder.Default
    private Integer dailySwipesRemaining = 20;
    @Builder.Default
    private Integer dailySwipesMax = 20;
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
