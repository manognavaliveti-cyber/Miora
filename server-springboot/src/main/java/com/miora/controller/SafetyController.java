package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.dto.BlockRequest;
import com.miora.dto.ReportRequest;
import com.miora.model.BlockItem;
import com.miora.model.SafetyReport;
import com.miora.security.SecurityUtils;
import com.miora.service.SafetyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SafetyController {

    private final SafetyService safetyService;

    public SafetyController(SafetyService safetyService) {
        this.safetyService = safetyService;
    }

    @GetMapping("/blocked")
    public ResponseEntity<ApiResponse<List<BlockItem>>> getBlockedUsers() {
        List<BlockItem> blocked = safetyService.getBlockedUsers();
        return ResponseEntity.ok(ApiResponse.ok(blocked));
    }

    @PostMapping("/block")
    public ResponseEntity<ApiResponse<BlockItem>> blockUser(@Valid @RequestBody BlockRequest request) {
        BlockItem item = safetyService.blockUser(
                request.getProfileId(),
                request.getProfileName(),
                request.getProfilePhoto()
        );
        return ResponseEntity.ok(ApiResponse.ok("User blocked successfully", item));
    }

    @PostMapping("/unblock")
    public ResponseEntity<ApiResponse<String>> unblockUser(@Valid @RequestBody BlockRequest request) {
        safetyService.unblockUser(request.getProfileId());
        return ResponseEntity.ok(ApiResponse.ok("User unblocked successfully", request.getProfileId()));
    }

    @PostMapping("/report")
    public ResponseEntity<ApiResponse<SafetyReport>> reportUser(@Valid @RequestBody ReportRequest request) {
        String reporterId = SecurityUtils.getCurrentUserId();
        SafetyReport report = safetyService.createReport(
                reporterId,
                request.getTargetProfileId(),
                request.getTargetProfileName(),
                request.getTargetPostId(),
                request.getTargetRoomId(),
                request.getReason(),
                request.getDetails()
        );
        return ResponseEntity.ok(ApiResponse.ok("Report submitted for review. Thank you for keeping MIORA safe.", report));
    }
}
