package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    private String id;
    private String profileId;
    private Profile profile;
    private String matchedAt;
    private String lastMessage;
    private String lastMessageTime;
    @Builder.Default
    private Integer unreadCount = 0;
}
