package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String id;
    private String matchId;
    private String senderId; // 'me' or profileId
    private String text;
    private String timestamp;
    @Builder.Default
    private Boolean read = false;
    @Builder.Default
    private String type = "text"; // text, gift, heart-crowned, call-log, game-invite
    private Map<String, Object> metadata;
}
