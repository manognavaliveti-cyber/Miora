package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pass {
    private String id;
    private String passerId; // the user who performed the pass
    private String passedId; // the profile/user being passed
    private String timestamp;
}
