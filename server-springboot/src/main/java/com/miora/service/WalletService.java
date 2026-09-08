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
     * Recharges coins with boundary validation.
     * Prevents negative or zero coin additions.
     */
    public synchronized Map<String, Object> rechargeCoins(String userId, int amount, String packageId, String paymentMethod) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Recharge amount must be strictly greater than 0.");
        }
        if (amount > 50000) {
            throw new IllegalArgumentException("Recharge amount exceeds maximum single transaction limit.");
        }

        User user = firestoreService.getUser(userId);
        if (user != null) {
            user.setCoinBalance(user.getCoinBalance() + amount);
            firestoreService.saveUser(user);
        }

        CoinTransaction tx = CoinTransaction.builder()
                .id("tx_" + UUID.randomUUID().toString().substring(0, 8))
                .userId(userId)
                .type("credit")
                .amount(amount)
                .coins(amount)
                .description("Recharged " + amount + " MIORA Coins")
                .timestamp("Just now")
                .category("purchase")
                .status("SUCCESS")
                .build();
        firestoreService.addTransaction(tx);

        Map<String, Object> response = new HashMap<>();
        response.put("newBalance", user != null ? user.getCoinBalance() : amount);
        response.put("transaction", tx);
        return response;
    }

    /**
     * Sends gift with strict balance deduction and block verification.
     * Prevents negative coin manipulation exploits.
     */
    public synchronized Map<String, Object> sendGift(String senderUserId, String recipientProfileId, String giftId,
                                        String giftName, String giftEmoji, int costCoins) {
        if (costCoins <= 0) {
            throw new IllegalArgumentException("Gift coin cost must be strictly greater than 0.");
        }
        if (costCoins > 10000) {
            throw new IllegalArgumentException("Gift cost exceeds maximum allowed threshold.");
        }

        // Check if recipient is blocked
        List<String> blockedIds = firestoreService.getBlockedProfileIds(senderUserId);
        if (blockedIds.contains(recipientProfileId)) {
            throw new SecurityException("Cannot send gifts to a blocked profile.");
        }

        User user = firestoreService.getUser(senderUserId);
        if (user == null || user.getCoinBalance() < costCoins) {
            throw new IllegalArgumentException("Insufficient coin balance for this gift (Required: " + costCoins + ", Available: " + (user != null ? user.getCoinBalance() : 0) + ")");
        }

        user.setCoinBalance(user.getCoinBalance() - costCoins);
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
                .amount(costCoins)
                .coins(costCoins)
                .description("Sent " + giftName + " " + (giftEmoji != null ? giftEmoji : "🎁") + " to " + (recipient != null ? recipient.getName() : "match"))
                .timestamp("Just now")
                .category("gift_sent")
                .status("SUCCESS")
                .build();
        firestoreService.addTransaction(tx);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("newBalance", user.getCoinBalance());
        response.put("transaction", tx);
        return response;
    }
}
