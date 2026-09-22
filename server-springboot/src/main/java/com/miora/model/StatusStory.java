package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusStory {
    private String id;
    private String authorId;
    private String authorName;
    private String authorPhoto;
    private String text;
    private String mediaUrl;
    private String createdAt;
    private String expiresAt;
    @Builder.Default
    private Boolean isViewed = false;
    @Builder.Default
    private Boolean isMine = false;
    @Builder.Default
    private Integer reactionsCount = 0;
    @Builder.Default
    private java.util.List<String> viewedByUserIds = new java.util.ArrayList<>();
}
