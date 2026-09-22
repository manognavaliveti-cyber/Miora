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
public class VerifyPaymentRequest {
    @NotBlank(message = "Razorpay Order ID is required")
    @Size(max = 128, message = "Razorpay Order ID is too long")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay Payment ID is required")
    @Size(max = 128, message = "Razorpay Payment ID is too long")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay Cryptographic Signature is required")
    @Size(max = 256, message = "Razorpay Signature is invalid")
    private String razorpaySignature;

    private String packageId;
    private String productId;

    public String getEffectiveProductId() {
        if (productId != null && !productId.trim().isEmpty()) return productId.trim();
        if (packageId != null && !packageId.trim().isEmpty()) return packageId.trim();
        return null;
    }
}
