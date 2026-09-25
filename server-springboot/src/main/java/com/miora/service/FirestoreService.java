package com.miora.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.miora.model.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService {

    private static final Logger log = LoggerFactory.getLogger(FirestoreService.class);

    @Autowired(required = false)
    private Firestore firestore;

    // In-Memory fallback cache
    private final Map<String, User> userCache = new ConcurrentHashMap<>();
    private final Map<String, Profile> profileCache = new ConcurrentHashMap<>();
    private final Map<String, Match> matchCache = new ConcurrentHashMap<>();
    private final List<Message> messageCache = Collections.synchronizedList(new ArrayList<>());
    private final List<Like> likeCache = Collections.synchronizedList(new ArrayList<>());
    // In-Memory pass cache
    private final List<Pass> passCache = Collections.synchronizedList(new ArrayList<>());
    private final List<BlockItem> blockCache = Collections.synchronizedList(new ArrayList<>());
    private final List<SafetyReport> reportCache = Collections.synchronizedList(new ArrayList<>());
    private final List<CoinTransaction> transactionCache = Collections.synchronizedList(new ArrayList<>());
    private final List<FeedPost> feedPostCache = Collections.synchronizedList(new ArrayList<>());
    private final List<StatusStory> statusStoryCache = Collections.synchronizedList(new ArrayList<>());
    private final List<FollowItem> followCache = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, UserStatus> statusNoteCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void initSeedData() {
        seedInitialProfiles();
        seedInitialUser();
        seedInitialFeedAndStories();
        seedInitialStatusNotes();
        seedInitialFollows();
    }

    public boolean isFirestoreAvailable() {
        return firestore != null;
    }

    // ==========================================
    // USER METHODS
    // ==========================================
    public User getUser(String userId) {
        String effectiveId = (userId != null && !userId.trim().isEmpty()) ? userId : "user_me";
        User user = null;
        if (isFirestoreAvailable()) {
            try {
                DocumentSnapshot doc = firestore.collection("users").document(effectiveId).get().get();
                if (doc.exists()) {
                    user = doc.toObject(User.class);
                    // Firestore stores numbers as Long by default. If walletBalance was written
                    // as an integer (Long), the CustomClassMapper silently maps it as null on a
                    // Double field, which would zero out the balance. Re-read it safely.
                    if (user != null && user.getWalletBalance() == null) {
                        Object rawWallet = doc.get("walletBalance");
                        if (rawWallet instanceof Number) {
                            user.setWalletBalance(((Number) rawWallet).doubleValue());
                        }
                    }
                    if (user != null && user.getCoinBalance() == null) {
                        Object rawCoins = doc.get("coinBalance");
                        if (rawCoins instanceof Number) {
                            user.setCoinBalance(((Number) rawCoins).intValue());
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Error fetching user from Firestore: {}", e.getMessage());
            }
        }
        if (user == null) {
            user = userCache.computeIfAbsent(effectiveId, id -> createDefaultUser(id, "dev@miora.app", "Alex"));
        }
        return evaluateEntitlementsAndLimits(user);
    }

    /**
     * Evaluates 28-day plan expiration and authoritative Asia/Kolkata daily limit resets.
     * Preserves wallet balance on membership expiration.
     */
    public User evaluateEntitlementsAndLimits(User user) {
        if (user == null) return null;

        // 1. Plan Expiration Evaluation (28-day validity)
        if (user.getSubscriptionExpiresAt() != null && !user.getSubscriptionExpiresAt().isEmpty()) {
            try {
                Instant expiresAt = Instant.parse(user.getSubscriptionExpiresAt());
                if (Instant.now().isAfter(expiresAt)) {
                    log.info("Subscription expired for user {}. Resetting to FREE tier. Wallet balance ₹{} preserved.",
                            user.getId(), user.getWalletBalance());
                    user.setIsPremium(false);
                    user.setSubscriptionTier("free");
                    user.setSubscriptionPlanId(null);
                    user.setSubscriptionExpiresAt(null);
                    user.setDailySwipesMax(10);
                    user.setDailyLikesMax(10);
                    user.setDailyMessagesMax(500);
                    user.setDailyAudioCallsMax(10);
                    user.setDailyVideoCallsMax(3);
                }
            } catch (Exception e) {
                log.warn("Could not parse subscription expiration date for user {}: {}", user.getId(), e.getMessage());
            }
        }

        // 2. Authoritative Asia/Kolkata Daily Limit Reset
        String todayString = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Kolkata")).toLocalDate().toString();
        if (user.getLastDailyResetDate() == null || !todayString.equals(user.getLastDailyResetDate())) {
            user.setLastDailyResetDate(todayString);
            String tier = user.getSubscriptionTier() != null ? user.getSubscriptionTier().toLowerCase() : "free";

            if ("vip".equals(tier)) {
                user.setDailySwipesMax(9999);
                user.setDailySwipesRemaining(9999);
                user.setDailyLikesMax(9999);
                user.setDailyLikesRemaining(9999);
                user.setDailyMessagesMax(9999);
                user.setDailyMessagesRemaining(9999);
                user.setDailyAudioCallsMax(9999);
                user.setDailyAudioCallsRemaining(9999);
                user.setDailyVideoCallsMax(9999);
                user.setDailyVideoCallsRemaining(9999);
            } else if ("pro".equals(tier)) {
                user.setDailySwipesMax(30);
                user.setDailySwipesRemaining(30);
                user.setDailyLikesMax(30);
                user.setDailyLikesRemaining(30);
                user.setDailyMessagesMax(1000);
                user.setDailyMessagesRemaining(1000);
                user.setDailyAudioCallsMax(30);
                user.setDailyAudioCallsRemaining(30);
                user.setDailyVideoCallsMax(20);
                user.setDailyVideoCallsRemaining(20);
            } else {
                // FREE Tier
                user.setDailySwipesMax(10);
                user.setDailySwipesRemaining(10);
                user.setDailyLikesMax(10);
                user.setDailyLikesRemaining(10);
                user.setDailyMessagesMax(500);
                user.setDailyMessagesRemaining(500);
                user.setDailyAudioCallsMax(10);
                user.setDailyAudioCallsRemaining(10);
                user.setDailyVideoCallsMax(3);
                user.setDailyVideoCallsRemaining(3);
            }
        }

        return user;
    }

    public User saveUser(User user) {
        userCache.put(user.getId(), user);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("users").document(user.getId()).set(user).get();
            } catch (Exception e) {
                log.warn("Error saving user to Firestore: {}", e.getMessage());
            }
        }
        return user;
    }

    // ==========================================
    // PROFILES METHODS
    // ==========================================
    public List<Profile> getProfiles() {
        if (isFirestoreAvailable()) {
            try {
                QuerySnapshot snapshot = firestore.collection("profiles").get().get();
                if (!snapshot.isEmpty()) {
                    return snapshot.toObjects(Profile.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching profiles from Firestore: {}", e.getMessage());
            }
        }
        return new ArrayList<>(profileCache.values());
    }

    public Profile getProfileById(String id) {
        if (isFirestoreAvailable()) {
            try {
                DocumentSnapshot doc = firestore.collection("profiles").document(id).get().get();
                if (doc.exists()) {
                    return doc.toObject(Profile.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching profile by id: {}", e.getMessage());
            }
        }
        return profileCache.get(id);
    }

    // ==========================================
    // MATCHES METHODS
    // ==========================================
    public List<Match> getMatches() {
        if (isFirestoreAvailable()) {
            try {
                QuerySnapshot snapshot = firestore.collection("matches").get().get();
                if (!snapshot.isEmpty()) {
                    return snapshot.toObjects(Match.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching matches from Firestore: {}", e.getMessage());
            }
        }
        return new ArrayList<>(matchCache.values());
    }

    public Match saveMatch(Match match) {
        matchCache.put(match.getId(), match);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("matches").document(match.getId()).set(match).get();
            } catch (Exception e) {
                log.warn("Error saving match to Firestore: {}", e.getMessage());
            }
        }
        return match;
    }

    // ==========================================
    // MESSAGES METHODS
    // ==========================================
    public List<Message> getMessages(String matchId) {
        if (isFirestoreAvailable()) {
            try {
                QuerySnapshot snapshot = firestore.collection("messages")
                        .whereEqualTo("matchId", matchId)
                        .get().get();
                if (!snapshot.isEmpty()) {
                    return snapshot.toObjects(Message.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching messages from Firestore: {}", e.getMessage());
            }
        }
        return messageCache.stream()
                .filter(m -> matchId.equals(m.getMatchId()))
                .toList();
    }

    public Message saveMessage(Message message) {
        messageCache.add(message);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("messages").document(message.getId()).set(message).get();
            } catch (Exception e) {
                log.warn("Error saving message to Firestore: {}", e.getMessage());
            }
        }
        return message;
    }

    // Mark messages as read for a given match and user (recipient)
    public void markMessagesAsRead(String matchId, String userId) {
        String now = Instant.now().toString();
        // Update in-memory cache
        for (Message msg : messageCache) {
            if (matchId.equals(msg.getMatchId()) && !userId.equals(msg.getSenderId())) {
                // Only mark messages not sent by the user as read
                if (!Boolean.TRUE.equals(msg.getRead())) {
                    msg.setRead(true);
                    msg.setReadAt(now);
                }
            }
        }
        // Persist changes to Firestore if available
        if (isFirestoreAvailable()) {
            try {
                // Query all messages for the match
                QuerySnapshot snapshot = firestore.collection("messages")
                        .whereEqualTo("matchId", matchId)
                        .get().get();
                if (!snapshot.isEmpty()) {
                    for (DocumentSnapshot doc : snapshot.getDocuments()) {
                        Message m = doc.toObject(Message.class);
                        if (m != null && !userId.equals(m.getSenderId()) && !Boolean.TRUE.equals(m.getRead())) {
                            m.setRead(true);
                            m.setReadAt(now);
                            firestore.collection("messages").document(m.getId()).set(m).get();
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Error marking messages as read: {}", e.getMessage());
            }
        }
    }

    // ==========================================
    // SAFETY & BLOCKS
    // ==========================================
    public List<BlockItem> getBlockedUsers() {
        return new ArrayList<>(blockCache);
    }

    public List<String> getBlockedProfileIds(String userId) {
        return blockCache.stream()
                .map(BlockItem::getProfileId)
                .filter(Objects::nonNull)
                .toList();
    }

    public void addBlock(BlockItem item) {
        blockCache.removeIf(b -> b.getProfileId().equals(item.getProfileId()));
        blockCache.add(item);
    }

    public void removeBlock(String profileId) {
        blockCache.removeIf(b -> b.getProfileId().equals(profileId));
    }

    public void saveReport(SafetyReport report) {
        reportCache.add(report);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("safety_reports").document(report.getId()).set(report).get();
            } catch (Exception e) {
                log.warn("Error saving report to Firestore: {}", e.getMessage());
            }
        }
    }

    // ==========================================
    // WALLET & TRANSACTIONS
    // ==========================================
    public List<CoinTransaction> getTransactions(String userId) {
        return new ArrayList<>(transactionCache);
    }

    public void addTransaction(CoinTransaction tx) {
        transactionCache.add(0, tx);
    }

    // ==========================================
    // FEED & STORIES
    // ==========================================
    public List<FeedPost> getFeedPosts() {
        return new ArrayList<>(feedPostCache);
    }

    public FeedPost getFeedPostById(String postId) {
        return feedPostCache.stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElse(null);
    }

    public FeedPost addFeedPost(FeedPost post) {
        feedPostCache.add(0, post);
        return post;
    }

    public FeedPost updateFeedPost(FeedPost post) {
        for (int i = 0; i < feedPostCache.size(); i++) {
            if (feedPostCache.get(i).getId().equals(post.getId())) {
                feedPostCache.set(i, post);
                return post;
            }
        }
        feedPostCache.add(0, post);
        return post;
    }

    public boolean deleteFeedPost(String postId) {
        return feedPostCache.removeIf(p -> p.getId().equals(postId));
    }

    public List<StatusStory> getStatusStories() {
        return new ArrayList<>(statusStoryCache);
    }

    public StatusStory addStatusStory(StatusStory story) {
        statusStoryCache.add(0, story);
        return story;
    }

    public boolean deleteStatusStory(String storyId, String authorId) {
        return statusStoryCache.removeIf(s -> s.getId().equals(storyId) && (authorId == null || authorId.equals(s.getAuthorId())));
    }

    // ==========================================
    // FOLLOW SYSTEM
    // ==========================================
    public boolean follow(String followerId, String followerName, String followerPhoto,
                          String followingId, String followingName, String followingPhoto) {
        if (followerId.equals(followingId)) return false;
        boolean alreadyFollowing = followCache.stream()
                .anyMatch(f -> f.getFollowerId().equals(followerId) && f.getFollowingId().equals(followingId));
        if (!alreadyFollowing) {
            FollowItem item = FollowItem.builder()
                    .id("flw_" + UUID.randomUUID().toString().substring(0, 8))
                    .followerId(followerId)
                    .followerName(followerName)
                    .followerPhoto(followerPhoto)
                    .followingId(followingId)
                    .followingName(followingName)
                    .followingPhoto(followingPhoto)
                    .createdAt(Instant.now().toString())
                    .build();
            followCache.add(item);
            return true;
        }
        return false;
    }

    public boolean unfollow(String followerId, String followingId) {
        return followCache.removeIf(f -> f.getFollowerId().equals(followerId) && f.getFollowingId().equals(followingId));
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followCache.stream()
                .anyMatch(f -> f.getFollowerId().equals(followerId) && f.getFollowingId().equals(followingId));
    }

    public List<FollowItem> getFollowers(String userId) {
        return followCache.stream()
                .filter(f -> f.getFollowingId().equals(userId))
                .toList();
    }

    public List<FollowItem> getFollowing(String userId) {
        return followCache.stream()
                .filter(f -> f.getFollowerId().equals(userId))
                .toList();
    }

    // ==========================================
    // STATUS NOTES (24H EPHEMERAL THOUGHTS)
    // ==========================================
    public UserStatus saveUserStatus(UserStatus status) {
        statusNoteCache.put(status.getUserId(), status);
        return status;
    }

    public UserStatus getUserStatus(String userId) {
        UserStatus status = statusNoteCache.get(userId);
        if (status != null && status.getExpiresAt() != null) {
            try {
                if (Instant.parse(status.getExpiresAt()).isBefore(Instant.now())) {
                    statusNoteCache.remove(userId);
                    return null;
                }
            } catch (Exception ignored) {}
        }
        return status;
    }

    public List<UserStatus> getAllActiveUserStatuses() {
        Instant now = Instant.now();
        List<UserStatus> activeList = new ArrayList<>();
        for (UserStatus s : statusNoteCache.values()) {
            if (s.getExpiresAt() != null) {
                try {
                    if (Instant.parse(s.getExpiresAt()).isBefore(now)) continue;
                } catch (Exception ignored) {}
            }
            activeList.add(s);
        }
        return activeList;
    }

    public void deleteUserStatus(String userId) {
        statusNoteCache.remove(userId);
    }

    // ==========================================
    // SEARCH PROFILES & POSTS
    // ==========================================
    public List<Profile> searchProfiles(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getProfiles();
        }
        String q = query.toLowerCase().trim();
        return getProfiles().stream()
                .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                        (p.getLocation() != null && p.getLocation().toLowerCase().contains(q)) ||
                        (p.getBio() != null && p.getBio().toLowerCase().contains(q)) ||
                        (p.getInterests() != null && p.getInterests().stream().anyMatch(i -> i.toLowerCase().contains(q))) ||
                        (p.getOccupation() != null && p.getOccupation().toLowerCase().contains(q)))
                .toList();
    }

    public List<FeedPost> searchFeedPosts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getFeedPosts();
        }
        String q = query.toLowerCase().trim().replace("#", "");
        return feedPostCache.stream()
                .filter(p -> (p.getContent() != null && p.getContent().toLowerCase().contains(q)) ||
                        (p.getLocation() != null && p.getLocation().toLowerCase().contains(q)) ||
                        (p.getAuthorName() != null && p.getAuthorName().toLowerCase().contains(q)) ||
                        (p.getTags() != null && p.getTags().stream().anyMatch(t -> t.toLowerCase().contains(q))))
                .toList();
    }

    // ==========================================
    // SEED DATA INITIALIZATION
    // ==========================================
    private void seedInitialUser() {
        User user = createDefaultUser("user_me", "dev@miora.app", "Dev");
        userCache.put(user.getId(), user);
    }

    private User createDefaultUser(String id, String email, String name) {
        return User.builder()
                .id(id != null ? id : "user_me")
                .name(name != null ? name : "Alex Rivera")
                .email(email != null ? email : "alex@miora.app")
                .age(24)
                .dateOfBirth("2000-08-14")
                .gender("man")
                .location("Bangalore, India")
                .bio("Product designer obsessed with aesthetics, indie music, slow coffee, and weekend getaways.")
                .photos(List.of(
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
                ))
                .interests(List.of("Music", "Travel", "Movies", "Photography", "Coffee", "Design"))
                .profileCompletion(90)
                .preferences(User.UserPreferences.builder()
                        .interestedIn("women")
                        .ageRange(new User.AgeRange(18, 30))
                        .maxDistanceKm(35)
                        .location("Bangalore")
                        .allowAudioCalls("matches")
                        .allowVideoCalls("matches")
                        .build())
                .walletBalance(0.0)
                .coinBalance(0)
                .talkTimeSecondsRemaining(480)
                .isPremium(false)
                .subscriptionTier("free")
                .dailySwipesRemaining(10)
                .dailySwipesMax(10)
                .dailyLikesRemaining(10)
                .dailyLikesMax(10)
                .dailyMessagesRemaining(500)
                .dailyMessagesMax(500)
                .dailyAudioCallsRemaining(10)
                .dailyAudioCallsMax(10)
                .dailyVideoCallsRemaining(3)
                .dailyVideoCallsMax(3)
                .superLikesRemaining(1)
                .boostsCount(1)
                .spotlightsCount(0)
                .build();
    }

    private void seedInitialProfiles() {
        Profile p1 = Profile.builder()
                .id("prof_1")
                .name("Priya")
                .age(22)
                .location("Chennai, India")
                .distanceKm(4.0)
                .bio("Love music, coffee, travel and discovering cozy aesthetic places. Currently designing delightful apps ☕✨")
                .photos(List.of(
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                ))
                .interests(List.of("Music", "Travel", "Movies", "Coffee", "Design"))
                .compatibility(87)
                .online(true)
                .gender("woman")
                .occupation("UI/UX Designer")
                .education("NIFT Chennai")
                .height("5'5\"")
                .matchedInterests(List.of("Music", "Travel", "Coffee", "Design"))
                .verified(true)
                .build();

        Profile p2 = Profile.builder()
                .id("prof_2")
                .name("Ananya")
                .age(21)
                .location("Hyderabad, India")
                .distanceKm(8.0)
                .bio("Architecture student who lives for sunset drives, live acoustic gigs, and secret dessert spots 🎨🎧")
                .photos(List.of(
                        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
                ))
                .interests(List.of("Art", "Music", "Food", "Travel"))
                .compatibility(92)
                .online(true)
                .gender("woman")
                .occupation("Architecture Student")
                .education("JNAFAU Hyderabad")
                .height("5'4\"")
                .matchedInterests(List.of("Art", "Music", "Travel"))
                .verified(true)
                .build();

        Profile p3 = Profile.builder()
                .id("prof_3")
                .name("Meera")
                .age(23)
                .location("Bangalore, India")
                .distanceKm(3.0)
                .bio("Building tech startups & bingeing Studio Ghibli. Obsessed with golden retriever energy and rooftop cafes 🍜🐕")
                .photos(List.of(
                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
                ))
                .interests(List.of("Gaming", "Pets", "Food", "Travel", "Tech"))
                .compatibility(95)
                .online(false)
                .gender("woman")
                .occupation("Software Engineer")
                .education("PES University")
                .height("5'6\"")
                .matchedInterests(List.of("Gaming", "Food", "Travel"))
                .verified(true)
                .build();

        profileCache.put(p1.getId(), p1);
        profileCache.put(p2.getId(), p2);
        profileCache.put(p3.getId(), p3);

        // Seed an initial match
        Match m1 = Match.builder()
                .id("match_1")
                .profileId(p1.getId())
                .profile(p1)
                .matchedAt("2 hours ago")
                .lastMessage("Hey there! Loved your music taste 🎶")
                .lastMessageTime("10:45 AM")
                .unreadCount(1)
                .build();
        matchCache.put(m1.getId(), m1);

        Message msg1 = Message.builder()
                .id("msg_1")
                .matchId("match_1")
                .senderId("prof_1")
                .text("Hey there! Loved your music taste 🎶")
                .timestamp("10:45 AM")
                .read(false)
                .type("text")
                .build();
        messageCache.add(msg1);
    }

    private void seedInitialFeedAndStories() {
        FeedPost.Comment c1 = FeedPost.Comment.builder()
                .id("c_seed_1")
                .userId("prof_2")
                .authorName("Ananya")
                .userPhoto("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80")
                .text("The lighting in this photo is perfection! ✨")
                .timestamp("30m ago")
                .build();

        FeedPost post1 = FeedPost.builder()
                .id("post_1")
                .authorId("prof_1")
                .authorName("Priya")
                .authorPhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80")
                .authorAge("22")
                .authorGender("woman")
                .location("Indiranagar, Bangalore")
                .content("Golden hour coffee hits different when the indie acoustic playlist is immaculate ✨☕ Where is your favorite spot in town?")
                .imageUrl("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80")
                .tags(List.of("Coffee", "Vibes", "Aesthetics"))
                .timestamp("1 hour ago")
                .likesCount(18)
                .isLikedByMe(false)
                .likedByUserIds(new ArrayList<>())
                .isSavedByMe(false)
                .savedByUserIds(new ArrayList<>())
                .sharesCount(4)
                .commentsCount(1)
                .comments(new ArrayList<>(List.of(c1)))
                .build();
        feedPostCache.add(post1);

        FeedPost post2 = FeedPost.builder()
                .id("post_2")
                .authorId("prof_2")
                .authorName("Ananya")
                .authorPhoto("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80")
                .authorAge("21")
                .authorGender("woman")
                .location("Jubilee Hills, Hyderabad")
                .content("Late night pottery and architectural sketch session with jazz in the background 🎨🏛️")
                .imageUrl("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80")
                .tags(List.of("Art", "Design", "NightVibes"))
                .timestamp("3 hours ago")
                .likesCount(34)
                .isLikedByMe(false)
                .likedByUserIds(new ArrayList<>())
                .isSavedByMe(false)
                .savedByUserIds(new ArrayList<>())
                .sharesCount(7)
                .commentsCount(0)
                .comments(new ArrayList<>())
                .build();
        feedPostCache.add(post2);

        StatusStory story1 = StatusStory.builder()
                .id("story_1")
                .authorId("prof_2")
                .authorName("Ananya")
                .authorPhoto("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80")
                .text("Exploring the hidden vinyl store in Indiranagar 🎵")
                .mediaUrl("https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80")
                .createdAt(Instant.now().toString())
                .expiresAt(Instant.now().plus(24, java.time.temporal.ChronoUnit.HOURS).toString())
                .reactionsCount(5)
                .viewedByUserIds(new ArrayList<>())
                .isViewed(false)
                .isMine(false)
                .build();
        statusStoryCache.add(story1);

        StatusStory story2 = StatusStory.builder()
                .id("story_2")
                .authorId("prof_1")
                .authorName("Priya")
                .authorPhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80")
                .text("Sunset colors tonight are unreal 🌅✨")
                .mediaUrl("https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&q=80")
                .createdAt(Instant.now().toString())
                .expiresAt(Instant.now().plus(24, java.time.temporal.ChronoUnit.HOURS).toString())
                .reactionsCount(12)
                .viewedByUserIds(new ArrayList<>())
                .isViewed(false)
                .isMine(false)
                .build();
        statusStoryCache.add(story2);
    }

    private void seedInitialStatusNotes() {
        UserStatus s1 = UserStatus.builder()
                .id("status_1")
                .userId("prof_1")
                .userName("Priya")
                .userPhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80")
                .noteText("Listening to Cigarettes After Sex 🎧")
                .emoji("🎵")
                .createdAt(Instant.now().toString())
                .expiresAt(Instant.now().plus(24, java.time.temporal.ChronoUnit.HOURS).toString())
                .build();
        statusNoteCache.put(s1.getUserId(), s1);

        UserStatus s2 = UserStatus.builder()
                .id("status_2")
                .userId("prof_2")
                .userName("Ananya")
                .userPhoto("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80")
                .noteText("Looking for coffee recommendations in Hyderabad ☕")
                .emoji("☕")
                .createdAt(Instant.now().toString())
                .expiresAt(Instant.now().plus(24, java.time.temporal.ChronoUnit.HOURS).toString())
                .build();
        statusNoteCache.put(s2.getUserId(), s2);
    }

    private void seedInitialFollows() {
        FollowItem f1 = FollowItem.builder()
                .id("flw_1")
                .followerId("user_me")
                .followerName("Dev")
                .followerPhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80")
                .followingId("prof_1")
                .followingName("Priya")
                .followingPhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80")
                .createdAt(Instant.now().toString())
                .build();
        followCache.add(f1);
    }

    // ==========================================
    // MONETIZATION & SUBSCRIPTIONS
    // ==========================================
    public User subscribeUser(String userId, String planId, String paymentMethod) {
        User user = getUser(userId);
        boolean isVip = "vip".equalsIgnoreCase(planId) || "yearly".equalsIgnoreCase(planId);
        user.setIsPremium(true);
        user.setSubscriptionTier(isVip ? "vip" : "gold");
        user.setSubscriptionPlanId(planId);
        user.setSubscriptionExpiresAt(Instant.now().plus(30, java.time.temporal.ChronoUnit.DAYS).toString());
        user.setDailySwipesRemaining(9999);

        // Grant bonus coins: +500 for Gold, +1500 for VIP
        int bonusCoins = isVip ? 1500 : 500;
        int currentBalance = user.getCoinBalance() != null ? user.getCoinBalance() : 0;
        user.setCoinBalance(currentBalance + bonusCoins);

        // Super Likes and Boost allocations
        user.setSuperLikesRemaining((user.getSuperLikesRemaining() != null ? user.getSuperLikesRemaining() : 0) + (isVip ? 30 : 15));
        user.setBoostsCount((user.getBoostsCount() != null ? user.getBoostsCount() : 0) + (isVip ? 5 : 2));
        user.setSpotlightsCount((user.getSpotlightsCount() != null ? user.getSpotlightsCount() : 0) + (isVip ? 2 : 0));

        // Ledger transaction record
        addTransaction(CoinTransaction.builder()
                .id("tx_" + UUID.randomUUID().toString().substring(0, 8))
                .userId(user.getId())
                .type("earned")
                .amount(bonusCoins)
                .title((isVip ? "VIP" : "Gold") + " Subscription Welcome Bonus")
                .description("Bonus coins credited upon " + (isVip ? "VIP" : "Gold") + " subscription activation")
                .timestamp("Just now")
                .status("completed")
                .build());

        return saveUser(user);
    }

    public User boostUser(String userId) {
        User user = getUser(userId);
        int boosts = user.getBoostsCount() != null ? user.getBoostsCount() : 1;
        user.setBoostsCount(Math.max(0, boosts - 1));
        user.setBoostActiveUntil(Instant.now().plus(30, java.time.temporal.ChronoUnit.MINUTES).toString());
        return saveUser(user);
    }

    public User spotlightUser(String userId) {
        User user = getUser(userId);
        int spotlights = user.getSpotlightsCount() != null ? user.getSpotlightsCount() : 1;
        user.setSpotlightsCount(Math.max(0, spotlights - 1));
        user.setSpotlightActiveUntil(Instant.now().plus(24, java.time.temporal.ChronoUnit.HOURS).toString());
        return saveUser(user);
    }

    public List<Map<String, Object>> getWhoLikedMe(String userId) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Profile> profs = getProfiles();
        for (int i = 0; i < Math.min(profs.size(), 5); i++) {
            Profile p = profs.get(i);
            Map<String, Object> item = new HashMap<>();
            item.put("id", "wlm_" + (i + 1));
            item.put("profileId", p.getId());
            item.put("profile", p);
            item.put("likedAt", (i * 2 + 1) + " hours ago");
            item.put("isSuperLike", i % 2 == 0);
            item.put("matchScore", p.getCompatibility() != null ? p.getCompatibility() : 88);
            result.add(item);
        }
        return result;
    }
// ADMIN HELPERS CONTINUE

    // ==========================================
    // ADMIN HELPERS
    // ==========================================

    /**
     * Return a list of all users (from cache or Firestore).
     */
    public java.util.List<User> getAllUsers() {
        if (isFirestoreAvailable()) {
            try {
                com.google.cloud.firestore.QuerySnapshot snapshot = firestore.collection("users").get().get();
                if (!snapshot.isEmpty()) {
                    return snapshot.toObjects(User.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching all users: {}", e.getMessage());
            }
        }
        return new java.util.ArrayList<>(userCache.values());
    }

    /**
     * Return a list of all safety reports.
     */
    public java.util.List<SafetyReport> getAllReports() {
        if (isFirestoreAvailable()) {
            try {
                com.google.cloud.firestore.QuerySnapshot snapshot = firestore.collection("safety_reports").get().get();
                if (!snapshot.isEmpty()) {
                    return snapshot.toObjects(SafetyReport.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching all reports: {}", e.getMessage());
            }
        }
        return new java.util.ArrayList<>(reportCache);
    }

    /**
     * Update an existing report (e.g., status, resolution metadata).
     */
    public void updateReport(SafetyReport report) {
        // Update in cache
        reportCache.removeIf(r -> r.getId().equals(report.getId()));
        reportCache.add(report);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("safety_reports").document(report.getId()).set(report).get();
            } catch (Exception e) {
                log.warn("Error updating report {}: {}", report.getId(), e.getMessage());
            }
        }
    }

    /**
     * Suspend or unsuspend a user.
     */
    public void setUserSuspended(String userId, boolean suspended) {
        User user = getUser(userId);
        if (user != null) {
            user.setSuspended(suspended);
            user.setStatus(suspended ? "SUSPENDED" : "ACTIVE");
            saveUser(user);
        }
    }

    /**
     * Ban or unban a user.
     */
    public void setUserBanned(String userId, boolean banned) {
        User user = getUser(userId);
        if (user != null) {
            user.setBanned(banned);
            user.setStatus(banned ? "BANNED" : "ACTIVE");
            saveUser(user);
        }
    }

    /**
     * Warn a user.
     */
    public void setUserWarned(String userId, String reason) {
        setUserWarned(userId, true, reason);
    }

    public void setUserWarned(String userId, boolean warned, String reason) {
        User user = getUser(userId);
        if (user != null) {
            user.setWarned(warned);
            user.setWarningReason(reason);
            saveUser(user);
        }
    }

    /**
     * Soft‑delete (deactivate) a user.
     */
    public void softDeleteUser(String userId) {
        User user = getUser(userId);
        if (user != null) {
            user.setDeleted(true);
            user.setStatus("DELETED");
            saveUser(user);
        }
    }

    // ==============================
    // ADMIN AUDIT LOG METHODS
    // ==============================
    private final List<AdminAuditLog> auditLogCache = Collections.synchronizedList(new ArrayList<>());

    public void saveAdminAuditLog(String adminUid, String action, String targetUid, String reason) {
        AdminAuditLog auditLog = AdminAuditLog.builder()
                .adminUid(adminUid)
                .action(action)
                .targetUid(targetUid)
                .reason(reason)
                .timestamp(Instant.now().toString())
                .build();
        saveAdminAuditLog(auditLog);
    }

    public void saveAdminAuditLog(AdminAuditLog logItem) {
        if (logItem.getId() == null) {
            logItem.setId("log_" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (logItem.getTimestamp() == null) {
            logItem.setTimestamp(Instant.now().toString());
        }
        auditLogCache.add(logItem);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("admin_audit_logs").document(logItem.getId()).set(logItem).get();
            } catch (Exception e) {
                log.warn("Error saving admin audit log to Firestore: {}", e.getMessage());
            }
        }
    }

    public List<AdminAuditLog> getAdminAuditLogs() {
        if (isFirestoreAvailable()) {
            try {
                QuerySnapshot snapshot = firestore.collection("admin_audit_logs").get().get();
                if (!snapshot.isEmpty()) {
                    return snapshot.toObjects(AdminAuditLog.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching admin audit logs: {}", e.getMessage());
            }
        }
        return new ArrayList<>(auditLogCache);
    }

    // ==============================
    // LIKE METHODS
    // ==============================
    /**
     * Persist a like action.
     */
    public void addLike(String likerId, String likedId, boolean isSuperLike) {
        // Prevent duplicate like in cache
        boolean exists = likeCache.stream()
                .anyMatch(l -> l.getLikerId().equals(likerId) && l.getLikedId().equals(likedId));
        if (!exists) {
            Like like = Like.builder()
                    .id(likerId + "_" + likedId)
                    .likerId(likerId)
                    .likedId(likedId)
                    .isSuperLike(isSuperLike)
                    .timestamp(Instant.now().toString())
                    .build();
            likeCache.add(like);
            if (isFirestoreAvailable()) {
                try {
                    firestore.collection("likes").document(like.getId()).set(like).get();
                } catch (Exception e) {
                    log.warn("Error saving like to Firestore: {}", e.getMessage());
                }
            }
        }
    }

    /**
     * Check if a like exists from likerId to likedId.
     */
    public boolean hasLike(String likerId, String likedId) {
        // Check in-memory cache first
        boolean inCache = likeCache.stream()
                .anyMatch(l -> l.getLikerId().equals(likerId) && l.getLikedId().equals(likedId));
        if (inCache) return true;
        // Fallback to Firestore query
        if (isFirestoreAvailable()) {
            try {
                DocumentSnapshot doc = firestore.collection("likes").document(likerId + "_" + likedId).get().get();
                return doc.exists();
            } catch (Exception e) {
                log.warn("Error checking like in Firestore: {}", e.getMessage());
            }
        }
        return false;
    }

    // ==============================
    // PASS METHODS
    // ==============================
    /**
     * Persist a pass action.
     */
    public void addPass(String passerId, String passedId) {
        boolean exists = passCache.stream()
                .anyMatch(p -> p.getPasserId().equals(passerId) && p.getPassedId().equals(passedId));
        if (!exists) {
            Pass pass = Pass.builder()
                    .id(passerId + "_" + passedId)
                    .passerId(passerId)
                    .passedId(passedId)
                    .timestamp(Instant.now().toString())
                    .build();
            passCache.add(pass);
            if (isFirestoreAvailable()) {
                try {
                    firestore.collection("passes").document(pass.getId()).set(pass).get();
                } catch (Exception e) {
                    log.warn("Error saving pass to Firestore: {}", e.getMessage());
                }
            }
        }
    }
    // ==============================
    // PURGE DATA FOR DELETED USERS
    // ==============================
    /**
     * Complete User Data Cleanup Workflow for Permanent Account Deletion (Requirements 5 & 6)
     * Cleans/anonymizes user owned records across likes, passes, matches, follows, status notes, stories, and discovery data.
     * Retains payment transactions, safety reports, and audit logs for fraud prevention/compliance.
     */
    public void purgeUserData(String userId) {
        if (userId == null || userId.trim().isEmpty()) return;

        // 1. Remove likes initiated by or directed to userId
        likeCache.removeIf(l -> userId.equals(l.getLikerId()) || userId.equals(l.getLikedId()));
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("likes").whereEqualTo("likerId", userId).get().get().forEach(doc -> doc.getReference().delete());
                firestore.collection("likes").whereEqualTo("likedId", userId).get().get().forEach(doc -> doc.getReference().delete());
            } catch (Exception e) {
                log.warn("Error purging Firestore likes for user {}: {}", userId, e.getMessage());
            }
        }

        // 2. Remove passes initiated by or directed to userId
        passCache.removeIf(p -> userId.equals(p.getPasserId()) || userId.equals(p.getPassedId()));
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("passes").whereEqualTo("passerId", userId).get().get().forEach(doc -> doc.getReference().delete());
                firestore.collection("passes").whereEqualTo("passedId", userId).get().get().forEach(doc -> doc.getReference().delete());
            } catch (Exception e) {
                log.warn("Error purging Firestore passes for user {}: {}", userId, e.getMessage());
            }
        }

        // 3. Clean up matches: remove matches involving userId
        matchCache.entrySet().removeIf(entry -> userId.equals(entry.getValue().getProfileId()) || entry.getKey().contains(userId));
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("matches").whereEqualTo("profileId", userId).get().get().forEach(doc -> doc.getReference().delete());
            } catch (Exception e) {
                log.warn("Error purging Firestore matches for user {}: {}", userId, e.getMessage());
            }
        }

        // 4. Remove follows
        followCache.removeIf(f -> userId.equals(f.getFollowerId()) || userId.equals(f.getFollowingId()));
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("follows").whereEqualTo("followerId", userId).get().get().forEach(doc -> doc.getReference().delete());
                firestore.collection("follows").whereEqualTo("followingId", userId).get().get().forEach(doc -> doc.getReference().delete());
            } catch (Exception e) {
                log.warn("Error purging Firestore follows for user {}: {}", userId, e.getMessage());
            }
        }

        // 5. Remove active status notes and stories
        deleteUserStatus(userId);
        statusStoryCache.removeIf(s -> userId.equals(s.getAuthorId()));
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("stories").whereEqualTo("authorId", userId).get().get().forEach(doc -> doc.getReference().delete());
            } catch (Exception e) {
                log.warn("Error purging Firestore stories for user {}: {}", userId, e.getMessage());
            }
        }

        // 6. Remove profile from discovery catalog
        profileCache.remove(userId);
        if (isFirestoreAvailable()) {
            try {
                firestore.collection("profiles").document(userId).delete().get();
            } catch (Exception e) {
                log.warn("Error deleting discovery profile doc for user {}: {}", userId, e.getMessage());
            }
        }
    }
}

