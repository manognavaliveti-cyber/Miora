package com.miora.service;

import com.miora.model.FeedPost;
import com.miora.model.StatusStory;
import com.miora.model.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private final FirestoreService firestoreService;

    public FeedService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<FeedPost> getFeedPosts(String userId) {
        List<FeedPost> posts = firestoreService.getFeedPosts();
        List<String> blockedUserIds = firestoreService.getBlockedProfileIds(userId);

        return posts.stream()
                .filter(p -> !blockedUserIds.contains(p.getAuthorId()))
                .map(p -> {
                    if (userId != null) {
                        p.setIsLikedByMe(p.getLikedByUserIds() != null && p.getLikedByUserIds().contains(userId));
                        p.setIsSavedByMe(p.getSavedByUserIds() != null && p.getSavedByUserIds().contains(userId));
                    }
                    return p;
                })
                .collect(Collectors.toList());
    }

    public FeedPost createFeedPost(String authorId, String content, String imageUrl, String location, List<String> tags) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Post content cannot be blank.");
        }

        User user = firestoreService.getUser(authorId);

        FeedPost post = FeedPost.builder()
                .id("post_" + UUID.randomUUID().toString().substring(0, 8))
                .authorId(authorId)
                .authorName(user != null ? user.getName() : "Alex")
                .authorPhoto(user != null && !user.getPhotos().isEmpty() ? user.getPhotos().get(0) : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80")
                .authorAge(user != null && user.getAge() != null ? user.getAge().toString() : "24")
                .authorGender(user != null ? user.getGender() : "woman")
                .location(location != null && !location.trim().isEmpty() ? location.trim() : (user != null ? user.getLocation() : "Bangalore"))
                .content(content.trim())
                .imageUrl(imageUrl != null ? imageUrl.trim() : "")
                .tags(tags != null ? tags : new ArrayList<>())
                .timestamp("Just now")
                .likesCount(0)
                .isLikedByMe(false)
                .likedByUserIds(new ArrayList<>())
                .isSavedByMe(false)
                .savedByUserIds(new ArrayList<>())
                .sharesCount(0)
                .commentsCount(0)
                .comments(new ArrayList<>())
                .build();

        return firestoreService.addFeedPost(post);
    }

    public FeedPost editFeedPost(String postId, String authorId, String newContent, String newLocation) {
        FeedPost post = firestoreService.getFeedPostById(postId);
        if (post == null) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }

        // BACKEND OWNERSHIP ENFORCEMENT
        if (!post.getAuthorId().equals(authorId)) {
            throw new SecurityException("Forbidden: You are not authorized to edit this post.");
        }

        if (newContent != null && !newContent.trim().isEmpty()) {
            post.setContent(newContent.trim());
        }
        if (newLocation != null) {
            post.setLocation(newLocation.trim());
        }
        return firestoreService.updateFeedPost(post);
    }

    public boolean deleteFeedPost(String postId, String authorId) {
        FeedPost post = firestoreService.getFeedPostById(postId);
        if (post == null) {
            return false;
        }

        // BACKEND OWNERSHIP ENFORCEMENT
        if (!post.getAuthorId().equals(authorId)) {
            throw new SecurityException("Forbidden: You are not authorized to delete this post.");
        }

        return firestoreService.deleteFeedPost(postId);
    }

    public FeedPost likeFeedPost(String postId, String userId) {
        FeedPost post = firestoreService.getFeedPostById(postId);
        if (post != null) {
            if (post.getLikedByUserIds() == null) {
                post.setLikedByUserIds(new ArrayList<>());
            }
            String uid = userId != null ? userId : "user_me";
            boolean wasLiked = post.getLikedByUserIds().contains(uid);

            if (wasLiked) {
                post.getLikedByUserIds().remove(uid);
                post.setIsLikedByMe(false);
                post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
            } else {
                post.getLikedByUserIds().add(uid);
                post.setIsLikedByMe(true);
                post.setLikesCount(post.getLikesCount() + 1);
            }
            return firestoreService.updateFeedPost(post);
        }
        return null;
    }

    public FeedPost toggleSavePost(String postId, String userId) {
        FeedPost post = firestoreService.getFeedPostById(postId);
        if (post != null) {
            if (post.getSavedByUserIds() == null) {
                post.setSavedByUserIds(new ArrayList<>());
            }
            String uid = userId != null ? userId : "user_me";
            boolean wasSaved = post.getSavedByUserIds().contains(uid);

            if (wasSaved) {
                post.getSavedByUserIds().remove(uid);
                post.setIsSavedByMe(false);
            } else {
                post.getSavedByUserIds().add(uid);
                post.setIsSavedByMe(true);
            }
            return firestoreService.updateFeedPost(post);
        }
        return null;
    }

    public FeedPost addComment(String postId, String userId, String authorName, String userPhoto, String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text cannot be blank.");
        }

        FeedPost post = firestoreService.getFeedPostById(postId);
        if (post == null) {
            return null;
        }

        // Check if author or commenter has blocked the other
        List<String> blockedIds = firestoreService.getBlockedProfileIds(userId);
        if (blockedIds.contains(post.getAuthorId())) {
            throw new SecurityException("Cannot comment on a post by a blocked user.");
        }

        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        FeedPost.Comment comment = FeedPost.Comment.builder()
                .id("c_" + UUID.randomUUID().toString().substring(0, 6))
                .userId(userId != null ? userId : "user_me")
                .authorName(authorName != null ? authorName : "You")
                .userPhoto(userPhoto != null ? userPhoto : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80")
                .text(text.trim())
                .timestamp("Just now")
                .build();

        post.getComments().add(comment);
        post.setCommentsCount(post.getComments().size());
        return firestoreService.updateFeedPost(post);
    }

    public FeedPost deleteComment(String postId, String commentId, String userId) {
        FeedPost post = firestoreService.getFeedPostById(postId);
        if (post == null || post.getComments() == null) {
            return null;
        }

        // OWNERSHIP ENFORCEMENT: Only the comment's creator OR the post's owner may delete the comment
        boolean removed = post.getComments().removeIf(c ->
                c.getId().equals(commentId) && (userId.equals(c.getUserId()) || userId.equals(post.getAuthorId()))
        );

        if (!removed) {
            throw new SecurityException("Forbidden: You are not authorized to delete this comment.");
        }

        post.setCommentsCount(post.getComments().size());
        return firestoreService.updateFeedPost(post);
    }

    public List<StatusStory> getStatusStories(String userId) {
        List<StatusStory> stories = firestoreService.getStatusStories();
        List<String> blockedUserIds = firestoreService.getBlockedProfileIds(userId);
        Instant now = Instant.now();

        return stories.stream()
                .filter(s -> !blockedUserIds.contains(s.getAuthorId()))
                .filter(s -> {
                    if (s.getExpiresAt() == null) return true;
                    try {
                        return Instant.parse(s.getExpiresAt()).isAfter(now);
                    } catch (Exception e) {
                        return true;
                    }
                })
                .map(s -> {
                    if (userId != null && userId.equals(s.getAuthorId())) {
                        s.setIsMine(true);
                    }
                    return s;
                })
                .collect(Collectors.toList());
    }

    public StatusStory createStatusStory(String authorId, String text, String mediaUrl) {
        User user = firestoreService.getUser(authorId);
        Instant now = Instant.now();
        Instant expiresAt = now.plus(24, ChronoUnit.HOURS);

        StatusStory story = StatusStory.builder()
                .id("story_" + UUID.randomUUID().toString().substring(0, 8))
                .authorId(authorId)
                .authorName(user != null ? user.getName() : "You")
                .authorPhoto(user != null && !user.getPhotos().isEmpty() ? user.getPhotos().get(0) : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80")
                .text(text != null ? text.trim() : "")
                .mediaUrl(mediaUrl != null ? mediaUrl.trim() : "")
                .createdAt(now.toString())
                .expiresAt(expiresAt.toString())
                .reactionsCount(0)
                .isViewed(false)
                .isMine(true)
                .build();

        return firestoreService.addStatusStory(story);
    }

    public boolean deleteStatusStory(String storyId, String authorId) {
        return firestoreService.deleteStatusStory(storyId, authorId);
    }
}
