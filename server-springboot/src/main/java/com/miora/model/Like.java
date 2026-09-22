// Like model
package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Like {
    private String id;
    private String likerId; // the user who performed the like
    private String likedId; // the profile/user being liked
    private Boolean isSuperLike;
    private String timestamp;
}
