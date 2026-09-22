package com.miora.dto.admin;

import com.miora.model.ModerationAction;
import com.miora.model.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResolutionDTO {
    private ReportStatus status;
    private ModerationAction moderationAction;
    private String resolvedByAdminUid;
    private String resolutionNote;
}
