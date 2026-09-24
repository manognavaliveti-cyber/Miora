package com.miora.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miora.dto.CreateOrderResponse;
import com.miora.dto.PaymentVerificationResponse;
import com.miora.model.CoinTransaction;
import com.miora.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${razorpay.key.id:}")
    private String keyId;

    @Value("${razorpay.key.secret:}")
    private String keySecret;

    private final FirestoreService firestoreService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    // Idempotency cache to prevent duplicate payment processing
    private final Set<String> processedPaymentIds = ConcurrentHashMap.newKeySet();
    private final Set<String> processedOrderIds = ConcurrentHashMap.newKeySet();

    public static class CoinPackage {
        private final String id;
        private final String type; // WALLET_TOPUP, PRO_SUBSCRIPTION, VIP_SUBSCRIPTION
        private final double walletCreditInr; // ₹ Wallet credit granted
        private final double bonusInr;
        private final int priceInr; // Payable price in Indian Rupees
        private final int regularPriceInr;
        private final String name;
        private final String icon;
        private final boolean popular;
        private final boolean bestValue;

        public CoinPackage(String id, String type, double walletCreditInr, double bonusInr, int priceInr, int regularPriceInr, String name, String icon, boolean popular, boolean bestValue) {
            this.id = id;
            this.type = type;
            this.walletCreditInr = walletCreditInr;
            this.bonusInr = bonusInr;
            this.priceInr = priceInr;
            this.regularPriceInr = regularPriceInr;
            this.name = name;
            this.icon = icon;
            this.popular = popular;
            this.bestValue = bestValue;
        }

        public String getId() { return id; }
        public String getType() { return type; }
        public double getWalletCreditInr() { return walletCreditInr; }
        public double getBonusInr() { return bonusInr; }
        public int getPriceInr() { return priceInr; }
        public int getRegularPriceInr() { return regularPriceInr; }
        public int getAmountPaise() { return priceInr * 100; }
        public String getName() { return name; }
        public String getIcon() { return icon; }
        public boolean isPopular() { return popular; }
        public boolean isBestValue() { return bestValue; }

        // Legacy compatibility getters
        public int getCoins() { return (int) walletCreditInr; }
        public int getBonusCoins() { return (int) bonusInr; }
        public int getTotalCoins() { return (int) (walletCreditInr + bonusInr); }
    }

    public RazorpayService(FirestoreService firestoreService, ObjectMapper objectMapper) {
        this.firestoreService = firestoreService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Checks if current time in Asia/Kolkata timezone is a Weekend (Saturday or Sunday).
     */
    public boolean isWeekendInKolkata() {
        ZonedDateTime nowKolkata = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        DayOfWeek day = nowKolkata.getDayOfWeek();
        return (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY);
    }

    public CoinPackage getPackage(String packageId) {
        if (packageId == null) return null;
        String normalizedId = packageId.trim().toLowerCase();

        switch (normalizedId) {
            // --- Subscriptions — ids/prices must mirror client/src/config/pricing.ts subscriptionPlans ---
            case "gold":
            case "pro":
            case "premium_379":
            case "premium_345":
            case "premium_promo":
                // MIORA Gold / PRO: ₹345/month, ₹524 wallet credit (₹499 + ₹25 bonus)
                return new CoinPackage("gold", "GOLD_SUBSCRIPTION", 524.0, 25.0, 345, 499, "MIORA Gold", "⚡", true, false);
            case "vip":
                // MIORA VIP Royalty: ₹999/month, +1500 wallet-credit bonus (matches pricing.ts: bonusCoins 1500)
                return new CoinPackage("vip", "VIP_SUBSCRIPTION", 1500.0, 1500.0, 999, 999, "MIORA VIP Royalty", "👑", false, true);

            // --- Wallet top-up packages — ids/prices must mirror pricing.ts rechargePackages ---
            case "pack_150":
            case "wallet_150_promo":
                return new CoinPackage("pack_150", "WALLET_TOPUP", 150.0, 71.0, 79, 150, "₹150 Wallet Credit", "✨", true, true);
            case "pack_100":
            case "coins_100":
                return new CoinPackage("pack_100", "WALLET_TOPUP", 100.0, 0.0, 100, 100, "₹100 Wallet Credit", "🌱", false, false);
            case "pack_39":
                return new CoinPackage("pack_39", "WALLET_TOPUP", 39.0, 0.0, 39, 39, "₹39 Wallet Credit", "🎮", false, false);
            case "pack_49":
                return new CoinPackage("pack_49", "WALLET_TOPUP", 49.0, 0.0, 49, 49, "₹49 Wallet Credit", "🎮", false, false);
            case "pack_500":
                return new CoinPackage("pack_500", "WALLET_TOPUP", 550.0, 50.0, 500, 500, "₹500 Wallet Credit", "🔥", false, false);
            case "wallet_1000":
            case "pack_1000":
                return new CoinPackage("wallet_1000", "WALLET_TOPUP", 1200.0, 200.0, 1000, 1000, "Add ₹1000", "💎", false, true);
            case "wallet_2500":
                return new CoinPackage("wallet_2500", "WALLET_TOPUP", 3200.0, 700.0, 2500, 2500, "VIP Pack ₹2500", "👑", false, false);
            default:
                return null;
        }
    }

    public List<CoinPackage> getAllPackages() {
        List<CoinPackage> list = new ArrayList<>();
        list.add(getPackage("pack_150"));
        list.add(getPackage("pack_100"));
        list.add(getPackage("pack_39"));
        list.add(getPackage("pack_49"));
        list.add(getPackage("pack_500"));
        list.add(getPackage("wallet_1000"));
        list.add(getPackage("wallet_2500"));
        list.add(getPackage("gold"));
        list.add(getPackage("vip"));
        return list;
    }

    /**
     * Creates an authentic Razorpay Order on the Razorpay Server using TEST credentials.
     * Never exposes keySecret.
     */
    public CreateOrderResponse createOrder(String userId, String packageId) {
        CoinPackage pkg = getPackage(packageId);
        if (pkg == null) {
            throw new IllegalArgumentException("Invalid product or package ID: " + packageId);
        }

        if (keyId == null || keyId.trim().isEmpty() || keySecret == null || keySecret.trim().isEmpty()) {
            throw new IllegalStateException("Razorpay credentials are not configured in backend environment.");
        }

        int amountPaise = pkg.getAmountPaise();
        String receipt = "rcpt_" + (userId != null ? userId.substring(0, Math.min(userId.length(), 10)) : "usr") + "_" + System.currentTimeMillis();

        try {
            Map<String, Object> orderPayload = new HashMap<>();
            orderPayload.put("amount", amountPaise);
            orderPayload.put("currency", "INR");
            orderPayload.put("receipt", receipt);

            Map<String, String> notes = new HashMap<>();
            notes.put("userId", userId != null ? userId : "anonymous");
            notes.put("productId", pkg.getId());
            notes.put("productType", pkg.getType());
            notes.put("walletCreditInr", String.valueOf(pkg.getWalletCreditInr()));
            orderPayload.put("notes", notes);

            String requestBody = objectMapper.writeValueAsString(orderPayload);
            String authHeader = "Basic " + Base64.getEncoder().encodeToString((keyId.trim() + ":" + keySecret.trim()).getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", authHeader)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode json = objectMapper.readTree(response.body());
                String orderId = json.get("id").asText();
                log.info("Successfully created Razorpay TEST Order: {} for user: {} (Product: {}, Type: {}, Payable: ₹{})",
                        orderId, userId, pkg.getId(), pkg.getType(), pkg.getPriceInr());

                return CreateOrderResponse.builder()
                        .orderId(orderId)
                        .amount(amountPaise)
                        .amountInr(pkg.getPriceInr())
                        .walletCreditInr(pkg.getWalletCreditInr())
                        .currency("INR")
                        .keyId(keyId.trim()) // Safe public Key ID for Razorpay Checkout
                        .productId(pkg.getId())
                        .productType(pkg.getType())
                        .packageId(pkg.getId())
                        .coins((int) pkg.getWalletCreditInr())
                        .productName(pkg.getName())
                        .packageName(pkg.getName())
                        .build();
            } else {
                log.error("Razorpay API order creation failed with status {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Razorpay API returned error (" + response.statusCode() + "): " + response.body());
            }
        } catch (Exception e) {
            log.error("Error connecting to Razorpay API: {}", e.getMessage());
            throw new RuntimeException("Could not create Razorpay order: " + e.getMessage(), e);
        }
    }

    /**
     * Cryptographically verifies the Razorpay payment signature using HMAC-SHA256.
     * ONLY after verification succeeds, credits ₹ wallet balance or activates PRO/VIP with IDEMPOTENCY guarantee.
     */
    public synchronized PaymentVerificationResponse verifyAndCreditPayment(
            String userId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            String packageId
    ) {
        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
            throw new IllegalArgumentException("Missing required Razorpay payment verification parameters.");
        }

        CoinPackage pkg = getPackage(packageId);
        if (pkg == null) {
            throw new IllegalArgumentException("Invalid product/package ID during verification: " + packageId);
        }

        // 1. Cryptographic HMAC-SHA256 Signature Verification
        boolean isValidSignature = verifyHmacSha256(razorpayOrderId.trim(), razorpayPaymentId.trim(), razorpaySignature.trim(), keySecret.trim());
        if (!isValidSignature) {
            log.warn("SECURITY ALERT: Invalid Razorpay signature attempt for Order: {}, Payment: {}, User: {}",
                    razorpayOrderId, razorpayPaymentId, userId);
            throw new SecurityException("Cryptographic payment signature verification failed. Untrusted payment details.");
        }

        log.info("Cryptographic Razorpay payment signature verified for Order: {}, Payment: {}", razorpayOrderId, razorpayPaymentId);

        User currentUser = firestoreService.getUser(userId);
        double currentWalletBalance = (currentUser != null && currentUser.getWalletBalance() != null) ? currentUser.getWalletBalance() : 0.0;
        boolean currentIsPremium = (currentUser != null && Boolean.TRUE.equals(currentUser.getIsPremium()));

        // 2. IDEMPOTENCY CHECK: Ensure the same payment ID or order ID is NEVER processed twice
        if (processedPaymentIds.contains(razorpayPaymentId) || processedOrderIds.contains(razorpayOrderId)) {
            log.info("Idempotency: Payment {} / Order {} was already processed. Returning current status.", razorpayPaymentId, razorpayOrderId);
            return PaymentVerificationResponse.builder()
                    .success(true)
                    .message("Payment already verified.")
                    .newWalletBalance(currentWalletBalance)
                    .creditAddedInr(0.0)
                    .isPremium(currentIsPremium)
                    .subscriptionTier(currentUser != null ? currentUser.getSubscriptionTier() : "free")
                    .newBalance((int) currentWalletBalance)
                    .coinsAdded(0)
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayPaymentId(razorpayPaymentId)
                    .build();
        }

        // Check persistent Firestore transactions for duplicate payment ID
        List<CoinTransaction> existingTxs = firestoreService.getTransactions(userId);
        boolean alreadyInFirestore = existingTxs != null && existingTxs.stream()
                .anyMatch(tx -> razorpayPaymentId.equals(tx.getRazorpayPaymentId()) || razorpayOrderId.equals(tx.getRazorpayOrderId()));

        if (alreadyInFirestore) {
            log.info("Idempotency: Found existing transaction in Firestore for payment {}. Skipping duplicate action.", razorpayPaymentId);
            processedPaymentIds.add(razorpayPaymentId);
            processedOrderIds.add(razorpayOrderId);
            return PaymentVerificationResponse.builder()
                    .success(true)
                    .message("Payment already verified and recorded in Firestore.")
                    .newWalletBalance(currentWalletBalance)
                    .creditAddedInr(0.0)
                    .isPremium(currentIsPremium)
                    .subscriptionTier(currentUser != null ? currentUser.getSubscriptionTier() : "free")
                    .newBalance((int) currentWalletBalance)
                    .coinsAdded(0)
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayPaymentId(razorpayPaymentId)
                    .build();
        }

        // 3. APPLY VERIFIED BENEFIT (Wallet Credit vs PRO / VIP Activation)
        double creditAdded = pkg.getWalletCreditInr();
        double newWalletBalance = currentWalletBalance + creditAdded;
        boolean isPremiumActive = currentIsPremium;
        String tier = (currentUser != null && currentUser.getSubscriptionTier() != null) ? currentUser.getSubscriptionTier() : "free";

        String expiresAt28Days = Instant.now().plus(28, ChronoUnit.DAYS).toString();

        if ("GOLD_SUBSCRIPTION".equals(pkg.getType())) {
            isPremiumActive = true;
            tier = "gold";
            if (currentUser != null) {
                currentUser.setIsPremium(true);
                currentUser.setSubscriptionTier("gold");
                currentUser.setSubscriptionPlanId("gold");
                currentUser.setSubscriptionExpiresAt(expiresAt28Days);
                currentUser.setWalletBalance(newWalletBalance);
                currentUser.setDailySwipesRemaining(30);
                currentUser.setDailySwipesMax(30);
                firestoreService.saveUser(currentUser);
            }
        } else if ("VIP_SUBSCRIPTION".equals(pkg.getType())) {
            isPremiumActive = true;
            tier = "vip";
            if (currentUser != null) {
                currentUser.setIsPremium(true);
                currentUser.setSubscriptionTier("vip");
                currentUser.setSubscriptionPlanId("vip");
                currentUser.setSubscriptionExpiresAt(expiresAt28Days);
                currentUser.setWalletBalance(newWalletBalance);
                currentUser.setDailySwipesRemaining(9999);
                currentUser.setDailySwipesMax(9999);
                firestoreService.saveUser(currentUser);
            }
        } else {
            // WALLET_TOPUP
            if (currentUser != null) {
                currentUser.setWalletBalance(newWalletBalance);
                firestoreService.saveUser(currentUser);
            }
        }

        // 4. RECORD COMPREHENSIVE TRANSACTION RECORD
        String desc;
        if ("GOLD_SUBSCRIPTION".equals(pkg.getType())) {
            desc = "MIORA Gold Activation: ₹" + pkg.getPriceInr() + "/month, unlimited swipes & advanced filters";
        } else if ("VIP_SUBSCRIPTION".equals(pkg.getType())) {
            desc = "MIORA VIP Royalty Activation: ₹" + pkg.getPriceInr() + "/month + ₹" + (int) pkg.getBonusInr() + " Wallet Bonus";
        } else {
            desc = "Purchased ₹" + (int) pkg.getWalletCreditInr() + " Wallet Credit for ₹" + pkg.getPriceInr();
        }

        CoinTransaction tx = CoinTransaction.builder()
                .id("tx_" + razorpayPaymentId)
                .userId(userId)
                .type(pkg.getType())
                .amount((int) creditAdded)
                .walletAmount(creditAdded)
                .paymentAmountInr((double) pkg.getPriceInr())
                .balanceBefore(currentWalletBalance)
                .balanceAfter(newWalletBalance)
                .amountInr(pkg.getPriceInr())
                .currency("INR")
                .description(desc)
                .timestamp("Just now")
                .createdAt(Instant.now().toString())
                .category(pkg.getType().contains("SUBSCRIPTION") ? "subscription" : "topup")
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .status("SUCCESS")
                .build();

        firestoreService.addTransaction(tx);

        // Mark as processed in idempotency tracker
        processedPaymentIds.add(razorpayPaymentId);
        processedOrderIds.add(razorpayOrderId);

        log.info("SUCCESS: Processed payment for user {}. Type: {}, New Balance: ₹{}, Tier: {} (Tx: {})",
                userId, pkg.getType(), newWalletBalance, tier, tx.getId());

        String successMsg;
        if ("GOLD_SUBSCRIPTION".equals(pkg.getType())) {
            successMsg = "Welcome to MIORA Gold! 28 Days Active — unlimited swipes, advanced filters & more ⚡";
        } else if ("VIP_SUBSCRIPTION".equals(pkg.getType())) {
            successMsg = "Welcome to MIORA VIP Royalty! 28 Days Active. ₹" + (int) pkg.getBonusInr() + " Wallet Credit added 👑";
        } else {
            successMsg = "Payment verified! ₹" + (int) creditAdded + " has been added to your MIORA Wallet.";
        }

        return PaymentVerificationResponse.builder()
                .success(true)
                .message(successMsg)
                .newWalletBalance(newWalletBalance)
                .creditAddedInr(creditAdded)
                .isPremium(isPremiumActive)
                .subscriptionTier(tier)
                .newBalance((int) newWalletBalance)
                .coinsAdded((int) creditAdded)
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .transaction(tx)
                .build();
    }

    /**
     * Helper: Cryptographic HMAC-SHA256 signature verification matching Razorpay Standard specification.
     */
    public static boolean verifyHmacSha256(String orderId, String paymentId, String actualSignature, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hashBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String expectedSignature = hexString.toString();

            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    actualSignature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("HMAC SHA256 computation error: {}", e.getMessage());
            return false;
        }
    }
}
