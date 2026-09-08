package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.dto.LikeRequest;
import com.miora.dto.PassRequest;
import com.miora.model.Match;
import com.miora.security.SecurityUtils;
import com.miora.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/matches")
    public ResponseEntity<ApiResponse<List<Match>>> getMatches() {
        String userId = SecurityUtils.getCurrentUserId();
        List<Match> matches = matchService.getMatches(userId);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }

    @PostMapping("/likes")
    public ResponseEntity<ApiResponse<Map<String, Object>>> likeProfile(@Valid @RequestBody LikeRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        Map<String, Object> result = matchService.handleLike(
                userId,
                request.getProfileId(),
                Boolean.TRUE.equals(request.getIsSuperLike())
        );
        return ResponseEntity.ok(ApiResponse.ok("Like processed successfully", result));
    }

    @PostMapping("/passes")
    public ResponseEntity<ApiResponse<Map<String, Object>>> passProfile(@Valid @RequestBody PassRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        Map<String, Object> result = matchService.handlePass(userId, request.getProfileId());
        return ResponseEntity.ok(ApiResponse.ok("Pass processed successfully", result));
    }
}
