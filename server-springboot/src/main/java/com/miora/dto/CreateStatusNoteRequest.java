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
public class CreateStatusNoteRequest {
    @NotBlank(message = "Status note text cannot be blank")
    @Size(max = 200, message = "Status note text cannot exceed 200 characters")
    private String text;

    @Size(max = 16, message = "Emoji representation is too long")
    private String emoji;
}
