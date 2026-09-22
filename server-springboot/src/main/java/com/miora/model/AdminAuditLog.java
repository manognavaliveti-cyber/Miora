package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAuditLog {
    private String id;
    private String adminUid;
    private String adminEmail;
    private String action; // USER_WARNED, USER_SUSPENDED, USER_UNSUSPENDED, USER_BANNED, REPORT_DISMISSED, REPORT_RESOLVED, ACCOUNT_DELETED
    private String targetUid;
    private String reason;
    private String timestamp;
}
