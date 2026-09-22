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
public class BlockRequest {
    @NotBlank(message = "Profile ID is required")
    @Size(max = 128, message = "Profile ID is too long")
    private String profileId;

    @Size(max = 100, message = "Profile name is too long")
    private String profileName;

    @Size(max = 500, message = "Profile photo URL is too long")
    private String profilePhoto;
}
