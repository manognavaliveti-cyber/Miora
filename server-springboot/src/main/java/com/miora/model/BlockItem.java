package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockItem {
    private String id;
    private String profileId;
    private String profileName;
    private String profilePhoto;
    private String blockedAt;
}
