package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.dto.CreateStatusNoteRequest;
import com.miora.model.FollowItem;
import com.miora.model.User;
import com.miora.model.UserStatus;
import com.miora.security.SecurityUtils;
import com.miora.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(@RequestBody User userUpdate) {
        String userId = SecurityUtils.getCurrentUserId();
        User updated = userService.updateUser(userId, userUpdate);
        return ResponseEntity.ok(ApiResponse.ok("User profile updated successfully", updated));
    }

    // ==========================================
    // FOLLOW SYSTEM
    // ==========================================
    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<ApiResponse<Boolean>> followUser(@PathVariable String targetUserId) {
        String followerId = SecurityUtils.getCurrentUserId();
        boolean success = userService.followUser(followerId, targetUserId);
        return ResponseEntity.ok(ApiResponse.ok(success ? "Followed successfully" : "Already following", success));
    }

    @PostMapping("/unfollow/{targetUserId}")
    public ResponseEntity<ApiResponse<Boolean>> unfollowUser(@PathVariable String targetUserId) {
        String followerId = SecurityUtils.getCurrentUserId();
        boolean success = userService.unfollowUser(followerId, targetUserId);
        return ResponseEntity.ok(ApiResponse.ok("Unfollowed successfully", success));
    }

    @GetMapping("/{userId}/is-following")
    public ResponseEntity<ApiResponse<Boolean>> isFollowing(@PathVariable String userId) {
        String currentUserId = SecurityUtils.getCurrentUserId();
        boolean following = userService.isFollowing(currentUserId, userId);
        return ResponseEntity.ok(ApiResponse.ok(following));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<ApiResponse<List<FollowItem>>> getFollowers(@PathVariable String userId) {
        List<FollowItem> followers = userService.getFollowers(userId);
        return ResponseEntity.ok(ApiResponse.ok(followers));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<ApiResponse<List<FollowItem>>> getFollowing(@PathVariable String userId) {
        List<FollowItem> following = userService.getFollowing(userId);
        return ResponseEntity.ok(ApiResponse.ok(following));
    }

    // ==========================================
    // STATUS NOTES
    // ==========================================
    @PostMapping("/status-note")
    public ResponseEntity<ApiResponse<UserStatus>> setStatusNote(@Valid @RequestBody CreateStatusNoteRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        UserStatus status = userService.setStatusNote(userId, request.getText(), request.getEmoji());
        return ResponseEntity.ok(ApiResponse.ok("Status note set", status));
    }

    @GetMapping("/status-notes")
    public ResponseEntity<ApiResponse<List<UserStatus>>> getStatusNotes() {
        List<UserStatus> statuses = userService.getActiveStatusNotes();
        return ResponseEntity.ok(ApiResponse.ok(statuses));
    }

    @DeleteMapping("/status-note")
    public ResponseEntity<ApiResponse<Void>> deleteStatusNote() {
        String userId = SecurityUtils.getCurrentUserId();
        userService.clearStatusNote(userId);
        return ResponseEntity.ok(ApiResponse.ok("Status note removed", null));
    }

    // ==========================================
    // SEARCH
    // ==========================================
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Map<String, Object>>> search(@RequestParam(required = false, defaultValue = "") String q) {
        String currentUserId = SecurityUtils.getCurrentUserId();
        Map<String, Object> results = userService.search(q, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
