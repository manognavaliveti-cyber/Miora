package com.miora.service;

import com.miora.model.Match;
import com.miora.model.Profile;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MatchService {

    private final FirestoreService firestoreService;

    public MatchService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<Match> getMatches(String userId) {
        List<String> blockedIds = firestoreService.getBlockedProfileIds(userId);
        List<Match> matches = firestoreService.getMatches();

        return matches.stream()
                .filter(m -> !blockedIds.contains(m.getProfileId()))
                .toList();
    }

    public Map<String, Object> handleLike(String userId, String profileId, boolean isSuperLike) {
        if (profileId == null || profileId.trim().isEmpty()) {
            throw new IllegalArgumentException("Profile ID is required for like action.");
        }

        // Enforce block policy
        List<String> blockedIds = firestoreService.getBlockedProfileIds(userId);
        if (blockedIds.contains(profileId)) {
            throw new SecurityException("Cannot like a blocked profile.");
        }

        Profile profile = firestoreService.getProfileById(profileId);
        Map<String, Object> result = new HashMap<>();
        result.put("profileId", profileId);
        result.put("isSuperLike", isSuperLike);

        if (profile != null) {
            profile.setLikedByCurrentUser(true);
            boolean isMatch = isSuperLike || Math.random() < 0.70;
            result.put("isMatch", isMatch);

            if (isMatch) {
                Match newMatch = Match.builder()
                        .id("match_" + UUID.randomUUID().toString().substring(0, 8))
                        .profileId(profile.getId())
                        .profile(profile)
                        .matchedAt("Just now")
                        .unreadCount(0)
                        .build();
                firestoreService.saveMatch(newMatch);
                result.put("match", newMatch);
            }
        } else {
            result.put("isMatch", false);
        }

        return result;
    }

    public Map<String, Object> handlePass(String userId, String profileId) {
        if (profileId == null || profileId.trim().isEmpty()) {
            throw new IllegalArgumentException("Profile ID is required for pass action.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("profileId", profileId);
        result.put("passed", true);
        return result;
    }
}
