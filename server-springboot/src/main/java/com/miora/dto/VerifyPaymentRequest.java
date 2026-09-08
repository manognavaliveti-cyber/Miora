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

    @NotBlank(message = "Package ID is required")
    @Size(max = 64, message = "Package ID is too long")
    private String packageId;
}
