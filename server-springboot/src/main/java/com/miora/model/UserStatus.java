package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatus {
    private String id;
    private String userId;
    private String userName;
    private String userPhoto;
    private String noteText;
    private String text;
    private String emoji;
    private String createdAt;
    private String expiresAt;
}
