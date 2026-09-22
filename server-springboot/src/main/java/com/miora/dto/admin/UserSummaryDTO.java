package com.miora.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private String id;
    private String name;
    private String email;
    private boolean suspended;
    private boolean banned;
    private boolean deleted;
    private boolean premium;
    private String status;
    private Boolean warned;
    private String warningReason;
}
