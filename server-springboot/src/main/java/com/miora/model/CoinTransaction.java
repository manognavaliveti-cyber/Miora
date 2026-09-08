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
    private String type; // credit, debit, PURCHASE
    private Integer amount; // coins credited or debited
    private Integer coins; // explicit coins field
    private Integer amountInr; // monetary price in INR
    private String currency; // INR
    private String description;
    private String timestamp;
    private String createdAt;
    private String category; // purchase, gift_sent, gift_received, talktime_convert, game_reward
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String status; // SUCCESS, FAILED, PENDING
}
