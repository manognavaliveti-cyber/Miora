package com.miora.service;

import com.miora.model.CoinTransaction;
import com.miora.model.Profile;
import com.miora.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WalletService {

    private final FirestoreService firestoreService;

    public WalletService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<CoinTransaction> getTransactions(String userId) {
        return firestoreService.getTransactions(userId);
    }

    /**
     * Recharges ₹ Wallet with boundary validation.
     */
    public synchronized Map<String, Object> rechargeWallet(String userId, double amount, String packageId, String paymentMethod) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Recharge amount must be strictly greater than 0.");
        }
        if (amount > 100000) {
            throw new IllegalArgumentException("Recharge amount exceeds maximum single transaction limit.");
        }

        User user = firestoreService.getUser(userId);
        double oldBal = user != null && user.getWalletBalance() != null ? user.getWalletBalance() : 0.0;
        double newBal = oldBal + amount;
        if (user != null) {
            user.setWalletBalance(newBal);
            firestoreService.saveUser(user);
        }

        CoinTransaction tx = CoinTransaction.builder()
                .id("tx_" + UUID.randomUUID().toString().substring(0, 8))
                .userId(userId)
                .type("credit")
                .amount((int) amount)
                .walletAmount(amount)
                .balanceBefore(oldBal)
                .balanceAfter(newBal)
                .description("Recharged ₹" + (int) amount + " to MIORA Wallet")
                .timestamp("Just now")
                .createdAt(java.time.Instant.now().toString())
                .category("purchase")
                .status("SUCCESS")
                .build();
        firestoreService.addTransaction(tx);

        Map<String, Object> response = new HashMap<>();
        response.put("newBalance", user != null ? user.getWalletBalance() : amount);
        response.put("transaction", tx);
        return response;
    }

    public synchronized Map<String, Object> rechargeCoins(String userId, int amount, String packageId, String paymentMethod) {
        return rechargeWallet(userId, (double) amount, packageId, paymentMethod);
    }

    /**
     * Sends gift with strict ₹ Wallet balance deduction and block verification.
     */
    public synchronized Map<String, Object> sendGift(String senderUserId, String recipientProfileId, String giftId,
                                        String giftName, String giftEmoji, int costAmount) {
        if (costAmount <= 0) {
            throw new IllegalArgumentException("Gift cost must be strictly greater than 0.");
        }

        // Check if recipient is blocked
        List<String> blockedIds = firestoreService.getBlockedProfileIds(senderUserId);
        if (blockedIds.contains(recipientProfileId)) {
            throw new SecurityException("Cannot send gifts to a blocked profile.");
        }

        User user = firestoreService.getUser(senderUserId);
        double currentBal = user != null && user.getWalletBalance() != null ? user.getWalletBalance() : 0.0;
        if (user == null || currentBal < costAmount) {
            throw new IllegalArgumentException("Insufficient wallet balance for this gift (Required: ₹" + costAmount + ", Available: ₹" + (int) currentBal + ")");
        }

        double newBal = currentBal - costAmount;
        user.setWalletBalance(newBal);
        firestoreService.saveUser(user);

        Profile recipient = firestoreService.getProfileById(recipientProfileId);
        if (recipient != null) {
            Map<String, Integer> gifts = recipient.getReceivedGifts();
            if (gifts == null) gifts = new HashMap<>();
            gifts.put(giftId, gifts.getOrDefault(giftId, 0) + 1);
            recipient.setReceivedGifts(gifts);
        }

        CoinTransaction tx = CoinTransaction.builder()
                .id("tx_" + UUID.randomUUID().toString().substring(0, 8))
                .userId(senderUserId)
                .type("debit")
                .amount(costAmount)
                .walletAmount((double) costAmount)
                .balanceBefore(currentBal)
                .balanceAfter(newBal)
                .description("Sent " + giftName + " " + (giftEmoji != null ? giftEmoji : "🎁") + " to " + (recipient != null ? recipient.getName() : "match"))
                .timestamp("Just now")
                .createdAt(java.time.Instant.now().toString())
                .category("gift_sent")
                .status("SUCCESS")
                .build();
        firestoreService.addTransaction(tx);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("newBalance", user.getWalletBalance());
        response.put("transaction", tx);
        return response;
    }
}
