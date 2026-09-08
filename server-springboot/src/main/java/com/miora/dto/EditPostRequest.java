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
public class EditPostRequest {
    @NotBlank(message = "Updated post content cannot be blank")
    @Size(max = 1000, message = "Post content cannot exceed 1000 characters")
    private String content;

    @Size(max = 100, message = "Location text is too long")
    private String location;
}
