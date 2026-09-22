package com.miora.dto;

import com.miora.model.CoinTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationResponse {
    private boolean success;
    private String message;
    private Double newWalletBalance;
    private Double creditAddedInr;
    private Boolean isPremium;
    private String subscriptionTier;
    private Integer newBalance; // legacy alias
    private Integer coinsAdded; // legacy alias
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private CoinTransaction transaction;
}
