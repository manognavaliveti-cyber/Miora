package com.miora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderResponse {
    private String orderId;
    private Integer amount; // amount in paise (e.g. 4900)
    private Integer amountInr; // amount in INR (e.g. 49)
    private String currency; // INR
    private String keyId; // Razorpay Key ID (public)
    private String packageId;
    private Integer coins;
    private String packageName;
}
