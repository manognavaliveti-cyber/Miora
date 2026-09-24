package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoinTransaction {
    private String id;
    private String userId;
    private String type; // WALLET_TOPUP, PAID_CHAT, AUDIO_CALL, VIDEO_CALL, PREMIUM_PURCHASE, REFUND
    private Integer amount; // legacy field
    private Double walletAmount; // ₹ wallet amount credited or debited
    private Double paymentAmountInr; // monetary price paid in INR (e.g. ₹79 for ₹150 credit, ₹345 for Premium)
    private Double balanceBefore;
    private Double balanceAfter;
    private Integer coins; // legacy field
    private Integer amountInr; // monetary price in INR (integer)
    private String currency; // INR
    private String title;
    private String description;
    private String timestamp;
    private String createdAt;
    private String category; // topup, chat, call, premium, refund
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String referenceId;
    private String status; // SUCCESS, FAILED, PENDING
}
