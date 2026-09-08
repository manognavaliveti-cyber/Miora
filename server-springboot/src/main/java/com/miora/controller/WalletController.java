package com.miora.controller;

import com.miora.dto.*;
import com.miora.model.CoinTransaction;
import com.miora.security.SecurityUtils;
import com.miora.service.RazorpayService;
import com.miora.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;
    private final RazorpayService razorpayService;

    public WalletController(WalletService walletService, RazorpayService razorpayService) {
        this.walletService = walletService;
        this.razorpayService = razorpayService;
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
        if (request == null || request.getPackageId() == null || request.getPackageId().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Package ID is required"));
        }

        try {
            CreateOrderResponse orderResponse = razorpayService.createOrder(userId, request.getPackageId().trim());
            return ResponseEntity.ok(ApiResponse.ok("Razorpay order created successfully", orderResponse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Payment order creation failed: " + e.getMessage()));
        }
    }

    /**
     * Cryptographically verifies the Razorpay HMAC-SHA256 signature using RAZORPAY_KEY_SECRET.
     * Idempotently credits the purchased coins to the authenticated user's wallet in Firestore.
     */
    @PostMapping(value = {"/payment/verify", "/verify-payment"})
    public ResponseEntity<ApiResponse<PaymentVerificationResponse>> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        if (request == null || request.getRazorpayOrderId() == null ||
                request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing required Razorpay payment verification parameters"));
        }

        try {
            PaymentVerificationResponse verificationResponse = razorpayService.verifyAndCreditPayment(
                    userId,
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    request.getPackageId()
            );
            return ResponseEntity.ok(ApiResponse.ok("Payment verified and coins credited", verificationResponse));
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
