package com.miora.controller;

import com.miora.dto.*;
import com.miora.model.FeedPost;
import com.miora.model.StatusStory;
import com.miora.security.SecurityUtils;
import com.miora.service.FeedService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<FeedPost>>> getPosts() {
        String userId = SecurityUtils.getCurrentUserId();
        List<FeedPost> posts = feedService.getFeedPosts(userId);
        return ResponseEntity.ok(ApiResponse.ok(posts));
    }

    @PostMapping("/posts")
    public ResponseEntity<ApiResponse<FeedPost>> createPost(@Valid @RequestBody CreatePostRequest request) {
        String authorId = SecurityUtils.getCurrentUserId();
        FeedPost post = feedService.createFeedPost(
                authorId,
                request.getContent(),
                request.getImageUrl(),
                request.getLocation(),
                request.getTags()
        );
        return ResponseEntity.ok(ApiResponse.ok("Post published", post));
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<FeedPost>> editPost(@PathVariable String id, @Valid @RequestBody EditPostRequest request) {
        String authorId = SecurityUtils.getCurrentUserId();
        FeedPost post = feedService.editFeedPost(id, authorId, request.getContent(), request.getLocation());
        if (post == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to edit post"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Post updated", post));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        String authorId = SecurityUtils.getCurrentUserId();
        boolean deleted = feedService.deleteFeedPost(id, authorId);
        if (!deleted) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete post"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Post deleted", null));
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<ApiResponse<FeedPost>> likePost(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        FeedPost post = feedService.likeFeedPost(id, userId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok(post));
    }

    @PostMapping("/posts/{id}/save")
    public ResponseEntity<ApiResponse<FeedPost>> toggleSavePost(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        FeedPost post = feedService.toggleSavePost(id, userId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok(post.getIsSavedByMe() ? "Post saved" : "Post unsaved", post));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<FeedPost>> addComment(@PathVariable String id, @Valid @RequestBody AddCommentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        String authorName = SecurityUtils.getCurrentPrincipal() != null ? SecurityUtils.getCurrentPrincipal().getName() : "You";
        FeedPost post = feedService.addComment(id, userId, authorName, null, request.getText());
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok("Comment added", post));
    }

    @DeleteMapping("/posts/{id}/comments/{commentId}")
    public ResponseEntity<ApiResponse<FeedPost>> deleteComment(@PathVariable String id, @PathVariable String commentId) {
        String userId = SecurityUtils.getCurrentUserId();
        FeedPost post = feedService.deleteComment(id, commentId, userId);
        if (post == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete comment"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Comment deleted", post));
    }

    @GetMapping("/stories")
    public ResponseEntity<ApiResponse<List<StatusStory>>> getStories() {
        String userId = SecurityUtils.getCurrentUserId();
        List<StatusStory> stories = feedService.getStatusStories(userId);
        return ResponseEntity.ok(ApiResponse.ok(stories));
    }

    @PostMapping("/stories")
    public ResponseEntity<ApiResponse<StatusStory>> createStory(@Valid @RequestBody CreateStoryRequest request) {
        String authorId = SecurityUtils.getCurrentUserId();
        StatusStory story = feedService.createStatusStory(
                authorId,
                request.getText(),
                request.getMediaUrl()
        );
        return ResponseEntity.ok(ApiResponse.ok("Story created", story));
    }

    @DeleteMapping("/stories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStory(@PathVariable String id) {
        String authorId = SecurityUtils.getCurrentUserId();
        boolean deleted = feedService.deleteStatusStory(id, authorId);
        if (!deleted) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete story"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Story deleted", null));
    }
}
