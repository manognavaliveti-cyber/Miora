package com.miora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    @NotBlank(message = "Match ID is required")
    @Size(max = 128, message = "Match ID is too long")
    private String matchId;

    @NotBlank(message = "Message text cannot be blank")
    @Size(max = 2000, message = "Message text cannot exceed 2000 characters")
    private String text;

    @Builder.Default
    @Size(max = 32, message = "Message type is too long")
    private String type = "text";

    private Map<String, Object> metadata;
}
