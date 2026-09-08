package com.miora.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStoryRequest {
    @Size(max = 500, message = "Story text cannot exceed 500 characters")
    private String text;

    @Size(max = 1000, message = "Media URL is too long")
    private String mediaUrl;
}
