package com.miora.service;

import com.miora.model.BlockItem;
import com.miora.model.SafetyReport;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SafetyService {

    private final FirestoreService firestoreService;

    public SafetyService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<BlockItem> getBlockedUsers() {
        return firestoreService.getBlockedUsers();
    }

    public BlockItem blockUser(String profileId, String profileName, String profilePhoto) {
        BlockItem item = BlockItem.builder()
                .id("block_" + UUID.randomUUID().toString().substring(0, 8))
                .profileId(profileId)
                .profileName(profileName != null ? profileName : "User")
                .profilePhoto(profilePhoto != null ? profilePhoto : "")
                .blockedAt("Just now")
                .build();
        firestoreService.addBlock(item);
        return item;
    }

    public void unblockUser(String profileId) {
        firestoreService.removeBlock(profileId);
    }

    public SafetyReport createReport(String reporterId, String targetProfileId, String targetProfileName,
                                     String targetPostId, String targetRoomId, String reason, String details) {
        SafetyReport report = SafetyReport.builder()
                .id("report_" + UUID.randomUUID().toString().substring(0, 8))
                .reporterId(reporterId)
                .targetProfileId(targetProfileId)
                .targetProfileName(targetProfileName)
                .targetPostId(targetPostId)
                .targetRoomId(targetRoomId)
                .reason(reason)
                .details(details)
                .reportedAt(Instant.now().toString())
                .status("UNDER_REVIEW")
                .build();
        firestoreService.saveReport(report);
        return report;
    }
}
