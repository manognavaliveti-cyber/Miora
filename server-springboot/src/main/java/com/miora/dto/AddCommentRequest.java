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
public class AddCommentRequest {
    @NotBlank(message = "Comment text cannot be blank")
    @Size(max = 500, message = "Comment text cannot exceed 500 characters")
    private String text;
}
