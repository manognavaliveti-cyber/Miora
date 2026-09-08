package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SafetyReport {
    private String id;
    private String reporterId;
    private String targetProfileId;
    private String targetProfileName;
    private String targetPostId;
    private String targetRoomId;
    private String reason;
    private String details;
    private String reportedAt;
    @Builder.Default
    private String status = "PENDING_REVIEW";
}
