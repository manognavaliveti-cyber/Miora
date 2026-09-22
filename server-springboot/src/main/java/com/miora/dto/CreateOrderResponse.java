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
    private Integer amount; // amount in paise (e.g. 7900)
    private Integer amountInr; // amount in INR (e.g. 79)
    private Double walletCreditInr; // credit in INR (e.g. 150.0)
    private String currency; // INR
    private String keyId; // Razorpay Key ID (public)
    private String packageId; // legacy alias
    private String productId;
    private String productType; // WALLET_TOPUP, PREMIUM_SUBSCRIPTION
    private Integer coins; // legacy alias
    private String packageName;
    private String productName;
}
