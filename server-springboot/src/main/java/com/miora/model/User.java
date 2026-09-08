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
    @Builder.Default
    private Boolean isPremium = false;
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
