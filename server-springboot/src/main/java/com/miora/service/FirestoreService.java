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
        if (isFirestoreAvailable()) {
            try {
                DocumentSnapshot doc = firestore.collection("users").document(effectiveId).get().get();
                if (doc.exists()) {
                    return doc.toObject(User.class);
                }
            } catch (Exception e) {
                log.warn("Error fetching user from Firestore: {}", e.getMessage());
            }
        }
        return userCache.computeIfAbsent(effectiveId, id -> createDefaultUser(id, "dev@miora.app", "Alex"));
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
                .coinBalance(350)
                .talkTimeSecondsRemaining(480)
                .isPremium(false)
                .subscriptionTier("free")
                .dailySwipesRemaining(20)
                .dailySwipesMax(20)
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
        boolean isPlatinum = "yearly".equalsIgnoreCase(planId);
        user.setIsPremium(true);
        user.setSubscriptionTier(isPlatinum ? "platinum" : "gold");
        user.setSubscriptionPlanId(planId);
        user.setSubscriptionExpiresAt(Instant.now().plus(isPlatinum ? 365 : "quarterly".equalsIgnoreCase(planId) ? 90 : 30, java.time.temporal.ChronoUnit.DAYS).toString());
        user.setDailySwipesRemaining(9999);
        user.setSuperLikesRemaining((user.getSuperLikesRemaining() != null ? user.getSuperLikesRemaining() : 0) + (isPlatinum ? 30 : 15));
        user.setBoostsCount((user.getBoostsCount() != null ? user.getBoostsCount() : 0) + (isPlatinum ? 12 : 3));
        user.setSpotlightsCount((user.getSpotlightsCount() != null ? user.getSpotlightsCount() : 0) + (isPlatinum ? 4 : 1));
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
}

