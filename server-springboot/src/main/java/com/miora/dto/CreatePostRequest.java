package com.miora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    @NotBlank(message = "Post content cannot be blank")
    @Size(max = 1000, message = "Post content cannot exceed 1000 characters")
    private String content;

    @Size(max = 1000, message = "Image URL is too long")
    private String imageUrl;

    @Size(max = 100, message = "Location text is too long")
    private String location;

    @Builder.Default
    private List<@Size(max = 50, message = "Tag name is too long") String> tags = new ArrayList<>();
}
