package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallSession {
    private String id;
    private String callerId;
    private String receiverId;
    private String callType; // "audio" or "video"
    private String status; // CREATED, RINGING, ACCEPTED, CONNECTED, REJECTED, ENDED, MISSED, EXPIRED
    private double costAmount; // e.g., 79.0
    private int maxDurationSeconds; // 300 for audio (5m), 120 for video (2m)
    private long createdAt; // epoch seconds
    private long connectedAt; // epoch seconds when call accepted & WebRTC connected
    private long expiresAt; // connectedAt + maxDurationSeconds
    private long endedAt; // epoch seconds when ended
    private boolean isRefunded; // true if rejected/missed and reservation released
    private String channelName;
}
