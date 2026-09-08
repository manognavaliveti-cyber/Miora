package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedPost {
    private String id;
    private String authorId;
    private String authorName;
    private String authorPhoto;
    private String authorAge;
    private String authorGender;
    private String location;
    private String content;
    private String imageUrl;
    @Builder.Default
    private List<String> tags = new ArrayList<>();
    private String timestamp;
    @Builder.Default
    private Integer likesCount = 0;
    @Builder.Default
    private Boolean isLikedByMe = false;
    @Builder.Default
    private List<String> likedByUserIds = new ArrayList<>();
    @Builder.Default
    private Boolean isSavedByMe = false;
    @Builder.Default
    private List<String> savedByUserIds = new ArrayList<>();
    @Builder.Default
    private Integer sharesCount = 0;
    @Builder.Default
    private Integer commentsCount = 0;
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String id;
        private String userId;
        private String authorName;
        private String userPhoto;
        private String text;
        private String timestamp;
    }
}
