package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {
    private String id;
    private String userId;
    private String partnerId;
    private double ratePerMinute; // 3.0
    private long startedAt; // epoch seconds
    private long lastMeteredAt; // epoch seconds
    private double totalDeducted; // total rupees deducted
    private String status; // ACTIVE, STOPPED_INSUFFICIENT_FUNDS, ENDED
}
