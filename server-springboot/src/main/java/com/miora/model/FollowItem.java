package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowItem {
    private String id;
    private String followerId;
    private String followerName;
    private String followerPhoto;
    private String followingId;
    private String followingName;
    private String followingPhoto;
    private String followingBio;
    private String createdAt;
}
