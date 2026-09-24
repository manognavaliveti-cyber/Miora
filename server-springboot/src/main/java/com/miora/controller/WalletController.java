package com.miora.controller;

import com.miora.dto.*;
import com.miora.model.CoinTransaction;
import com.miora.model.User;
import com.miora.security.SecurityUtils;
import com.miora.service.FirestoreService;
import com.miora.service.RazorpayService;
import com.miora.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;
    private final RazorpayService razorpayService;
    private final FirestoreService firestoreService;

    public WalletController(WalletService walletService, RazorpayService razorpayService, FirestoreService firestoreService) {
        this.walletService = walletService;
        this.razorpayService = razorpayService;
        this.firestoreService = firestoreService;
    }

    /**
     * GET /api/wallet
     * Returns the authenticated user's current wallet and coin balances.
     * Frontend expects: { walletBalance: number, coinBalance: number }
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWallet() {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            User user = firestoreService.getUser(userId);
            Map<String, Object> balance = new HashMap<>();
            balance.put("walletBalance", user != null && user.getWalletBalance() != null ? user.getWalletBalance() : 0.0);
            balance.put("coinBalance", user != null && user.getCoinBalance() != null ? user.getCoinBalance() : 0);
            return ResponseEntity.ok(ApiResponse.ok("Wallet balance retrieved", balance));
        } catch (Exception e) {
            // Return safe defaults rather than 500 — client has local fallback for balance display.
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("walletBalance", 0.0);
            fallback.put("coinBalance", 0);
            return ResponseEntity.ok(ApiResponse.ok("Wallet balance (fallback)", fallback));
        }
    }

    /**
     * POST /api/wallet/debit
     * Debits a given INR amount from the authenticated user's wallet balance.
     * Request body: { amount: number }
     * Response: { walletBalance: number, coinBalance: number }
     */
    @PostMapping("/debit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> debitWallet(@RequestBody Map<String, Object> body) {
        try {
            String userId = SecurityUtils.getCurrentUserId();
            double amount;
            try {
                amount = Double.parseDouble(String.valueOf(body.get("amount")));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or missing 'amount' in request body"));
            }
            if (amount <= 0) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Debit amount must be greater than 0"));
            }

            User user = firestoreService.getUser(userId);
            double currentBalance = user != null && user.getWalletBalance() != null ? user.getWalletBalance() : 0.0;
            if (currentBalance < amount) {
                return ResponseEntity.badRequest().body(ApiResponse.error(
                        "Insufficient wallet balance (Required: ₹" + (int) amount + ", Available: ₹" + (int) currentBalance + ")"
                ));
            }

            double newBalance = currentBalance - amount;
            if (user != null) {
                user.setWalletBalance(newBalance);
                firestoreService.saveUser(user);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("walletBalance", newBalance);
            result.put("coinBalance", user != null && user.getCoinBalance() != null ? user.getCoinBalance() : 0);
            return ResponseEntity.ok(ApiResponse.ok("Wallet debited successfully", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Wallet debit failed: " + e.getMessage()));
        }
    }

    @GetMapping("/packages")
    public ResponseEntity<ApiResponse<List<RazorpayService.CoinPackage>>> getPackages() {
        return ResponseEntity.ok(ApiResponse.ok(razorpayService.getAllPackages()));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<CoinTransaction>>> getTransactions() {
        String userId = SecurityUtils.getCurrentUserId();
        List<CoinTransaction> txs = walletService.getTransactions(userId);
        return ResponseEntity.ok(ApiResponse.ok(txs));
    }

    /**
     * Creates an authentic Razorpay Order on the Razorpay server for purchasing MIORA coins.
     * React sends only the package ID. Spring Boot calculates the price and coins server-side.
     */
    @PostMapping(value = {"/payment/create-order", "/create-order"})
    public ResponseEntity<ApiResponse<CreateOrderResponse>> createPaymentOrder(@Valid @RequestBody CreateOrderRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        String productId = request != null ? request.getEffectiveProductId() : null;
        if (productId == null || productId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Product/Package ID is required"));
        }

        try {
            CreateOrderResponse orderResponse = razorpayService.createOrder(userId, productId.trim());
            return ResponseEntity.ok(ApiResponse.ok("Razorpay order created successfully", orderResponse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Payment order creation failed: " + e.getMessage()));
        }
    }

    /**
     * Cryptographically verifies the Razorpay HMAC-SHA256 signature using RAZORPAY_KEY_SECRET.
     * Idempotently credits ₹ wallet balance or activates Premium subscription.
     */
    @PostMapping(value = {"/payment/verify", "/verify-payment"})
    public ResponseEntity<ApiResponse<PaymentVerificationResponse>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        if (request == null || request.getRazorpayOrderId() == null ||
                request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing required Razorpay payment verification parameters"));
        }

        String productId = request.getEffectiveProductId();
        if (productId == null || productId.trim().isEmpty()) {
            productId = "pack_150";
        }

        try {
            PaymentVerificationResponse verificationResponse = razorpayService.verifyAndCreditPayment(
                    userId,
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    productId.trim()
            );
            return ResponseEntity.ok(ApiResponse.ok("Payment verified successfully", verificationResponse));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Payment verification error: " + e.getMessage()));
        }
    }

    @PostMapping("/recharge")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rechargeCoins(@Valid @RequestBody RechargeRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        int amount = request.getAmount() != null ? request.getAmount() : 100;
        Map<String, Object> result = walletService.rechargeCoins(
                userId,
                amount,
                request.getPackageId(),
                request.getPaymentMethod()
        );
        return ResponseEntity.ok(ApiResponse.ok("Coins recharged successfully", result));
    }

    @PostMapping("/gift")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendGift(@Valid @RequestBody SendGiftRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        int cost = request.getCostCoins() != null ? request.getCostCoins() : 10;
        Map<String, Object> result = walletService.sendGift(
                userId,
                request.getRecipientProfileId(),
                request.getGiftId(),
                request.getGiftName(),
                request.getGiftEmoji(),
                cost
        );
        return ResponseEntity.ok(ApiResponse.ok("Gift sent successfully ✨", result));
    }
}
