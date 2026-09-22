package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {
    private String id;
    private String userId;
    private String type; // WALLET_PACK_PURCHASE, PAID_CHAT, AUDIO_CALL, VIDEO_CALL, REFUND, ADMIN_ADJUSTMENT
    private double amount; // Rupee value credited or debited
    private double paymentAmount; // Price paid in real money (e.g. ₹79)
    private double walletCredit; // Credit received in wallet (e.g. ₹150)
    private double balanceBefore;
    private double balanceAfter;
    private String referenceId; // Order ID or Session ID
    private String description;
    private String timestamp;
    private String status; // SUCCESS, PENDING, FAILED, REFUNDED
}
