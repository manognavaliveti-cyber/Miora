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
public class CreateOrderRequest {
    private String packageId;
    private String productId;

    public String getEffectiveProductId() {
        if (productId != null && !productId.trim().isEmpty()) return productId.trim();
        if (packageId != null && !packageId.trim().isEmpty()) return packageId.trim();
        return null;
    }
}
