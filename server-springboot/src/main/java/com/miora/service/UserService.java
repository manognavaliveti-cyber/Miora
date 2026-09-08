package com.miora.service;

import com.miora.model.FeedPost;
import com.miora.model.FollowItem;
import com.miora.model.Profile;
import com.miora.model.User;
import com.miora.model.UserStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {

    private final FirestoreService firestoreService;

    public UserService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public User getUserById(String userId) {
        return firestoreService.getUser(userId);
    }

    /**
     * Updates user profile data securely.
     * CRITICAL SECURITY HARDENING:
     * Strips and protects sensitive wallet and permission fields (coinBalance, isPremium,
     * talkTimeSecondsRemaining, receivedGifts, gamesWonCount) so they CANNOT be manipulated
     * via client profile updates.
     */
    public User updateUser(String userId, User updateData) {
        User existing = firestoreService.getUser(userId);
        if (existing == null) {
            // New user registration - initialize with safe defaults
            updateData.setId(userId);
            updateData.setCoinBalance(350);
            updateData.setIsPremium(false);
            updateData.setTalkTimeSecondsRemaining(420);
            updateData.setReceivedGifts(new HashMap<>());
            updateData.setGamesWonCount(0);
            return firestoreService.saveUser(updateData);
        }

        // Safe profile fields only
        if (updateData.getName() != null && !updateData.getName().trim().isEmpty()) {
            existing.setName(updateData.getName().trim());
        }
        if (updateData.getBio() != null) {
            existing.setBio(updateData.getBio().trim());
        }
        if (updateData.getAge() != null && updateData.getAge() >= 18 && updateData.getAge() <= 120) {
            existing.setAge(updateData.getAge());
        }
        if (updateData.getDateOfBirth() != null) {
            existing.setDateOfBirth(updateData.getDateOfBirth());
        }
        if (updateData.getLocation() != null) {
            existing.setLocation(updateData.getLocation().trim());
        }
        if (updateData.getGender() != null) {
            existing.setGender(updateData.getGender().trim());
        }
        if (updateData.getOccupation() != null) {
            existing.setOccupation(updateData.getOccupation().trim());
        }
        if (updateData.getEducation() != null) {
            existing.setEducation(updateData.getEducation().trim());
        }
        if (updateData.getPhotos() != null) {
            existing.setPhotos(updateData.getPhotos());
        }
        if (updateData.getInterests() != null) {
            existing.setInterests(updateData.getInterests());
        }
        if (updateData.getPreferences() != null) {
            existing.setPreferences(updateData.getPreferences());
        }
        if (updateData.getLifestyle() != null) {
            existing.setLifestyle(updateData.getLifestyle());
        }
        if (updateData.getProfileCompletion() != null) {
            existing.setProfileCompletion(Math.min(100, Math.max(0, updateData.getProfileCompletion())));
        }

        // NOTE: coinBalance, talkTimeSecondsRemaining, isPremium, receivedGifts, gamesWonCount
        // are strictly NEVER updated through general profile mutation.

        return firestoreService.saveUser(existing);
    }

    // ==========================================
    // FOLLOW METHODS
    // ==========================================
    public boolean followUser(String followerId, String targetUserId) {
        if (followerId == null || targetUserId == null || followerId.equals(targetUserId)) {
            return false;
        }

        // Enforce block policy: cannot follow blocked users or users who blocked caller
        List<String> blockedIds = firestoreService.getBlockedProfileIds(followerId);
        if (blockedIds.contains(targetUserId)) {
            throw new SecurityException("Cannot follow a blocked user.");
        }

        User follower = firestoreService.getUser(followerId);
        Profile targetProfile = firestoreService.getProfileById(targetUserId);
        String targetName = targetProfile != null ? targetProfile.getName() : "User";
        String targetPhoto = (targetProfile != null && targetProfile.getPhotos() != null && !targetProfile.getPhotos().isEmpty())
                ? targetProfile.getPhotos().get(0)
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

        String followerName = follower != null ? follower.getName() : "You";
        String followerPhoto = (follower != null && follower.getPhotos() != null && !follower.getPhotos().isEmpty())
                ? follower.getPhotos().get(0)
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

        return firestoreService.follow(followerId, followerName, followerPhoto, targetUserId, targetName, targetPhoto);
    }

    public boolean unfollowUser(String followerId, String targetUserId) {
        return firestoreService.unfollow(followerId, targetUserId);
    }

    public boolean isFollowing(String followerId, String targetUserId) {
        return firestoreService.isFollowing(followerId, targetUserId);
    }

    public List<FollowItem> getFollowers(String userId) {
        return firestoreService.getFollowers(userId);
    }

    public List<FollowItem> getFollowing(String userId) {
        return firestoreService.getFollowing(userId);
    }

    // ==========================================
    // STATUS NOTES
    // ==========================================
    public UserStatus setStatusNote(String userId, String noteText, String emoji) {
        if (noteText == null || noteText.trim().isEmpty()) {
            throw new IllegalArgumentException("Status note text cannot be blank.");
        }

        User user = firestoreService.getUser(userId);
        Instant now = Instant.now();
        Instant expiresAt = now.plus(24, ChronoUnit.HOURS);

        UserStatus status = UserStatus.builder()
                .id("sn_" + UUID.randomUUID().toString().substring(0, 8))
                .userId(userId)
                .userName(user != null ? user.getName() : "You")
                .userPhoto(user != null && user.getPhotos() != null && !user.getPhotos().isEmpty()
                        ? user.getPhotos().get(0)
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80")
                .noteText(noteText.trim())
                .emoji(emoji != null && !emoji.trim().isEmpty() ? emoji.trim() : "✨")
                .createdAt(now.toString())
                .expiresAt(expiresAt.toString())
                .build();

        return firestoreService.saveUserStatus(status);
    }

    public List<UserStatus> getActiveStatusNotes() {
        return firestoreService.getAllActiveUserStatuses();
    }

    public void clearStatusNote(String userId) {
        firestoreService.deleteUserStatus(userId);
    }

    // ==========================================
    // SEARCH (Filters blocked profiles)
    // ==========================================
    public Map<String, Object> search(String query, String currentUserId) {
        List<Profile> profiles = firestoreService.searchProfiles(query);
        List<FeedPost> posts = firestoreService.searchFeedPosts(query);

        List<String> blockedIds = firestoreService.getBlockedProfileIds(currentUserId);
        List<Profile> filteredProfiles = profiles.stream()
                .filter(p -> !blockedIds.contains(p.getId()))
                .toList();

        List<FeedPost> filteredPosts = posts.stream()
                .filter(p -> !blockedIds.contains(p.getAuthorId()))
                .toList();

        Map<String, Object> results = new HashMap<>();
        results.put("profiles", filteredProfiles);
        results.put("posts", filteredPosts);
        return results;
    }
}
