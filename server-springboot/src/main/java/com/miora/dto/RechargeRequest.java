package com.miora.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RechargeRequest {
    @NotNull(message = "Coin amount is required")
    @Min(value = 1, message = "Amount must be at least 1 coin")
    @Max(value = 50000, message = "Amount cannot exceed 50,000 coins per transaction")
    private Integer amount;

    @Size(max = 64, message = "Package ID is too long")
    private String packageId;

    @Size(max = 32, message = "Payment method name is too long")
    private String paymentMethod;
}
