package com.miora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {
    @Size(max = 128, message = "Target profile ID is too long")
    private String targetProfileId;

    @Size(max = 100, message = "Target profile name is too long")
    private String targetProfileName;

    @Size(max = 128, message = "Target post ID is too long")
    private String targetPostId;

    @Size(max = 128, message = "Target room ID is too long")
    private String targetRoomId;

    @NotBlank(message = "Reason for report is required")
    @Size(max = 200, message = "Report reason cannot exceed 200 characters")
    private String reason;

    @Size(max = 2000, message = "Report details cannot exceed 2000 characters")
    private String details;
}
