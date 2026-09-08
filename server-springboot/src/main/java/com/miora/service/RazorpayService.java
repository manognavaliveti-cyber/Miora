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
import java.time.Duration;
import java.time.Instant;
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

    // Idempotency cache to prevent duplicate coin crediting
    private final Set<String> processedPaymentIds = ConcurrentHashMap.newKeySet();
    private final Set<String> processedOrderIds = ConcurrentHashMap.newKeySet();

    public static class CoinPackage {
        private final String id;
        private final int coins;
        private final int priceInr; // In Indian Rupees
        private final String name;

        public CoinPackage(String id, int coins, int priceInr, String name) {
            this.id = id;
            this.coins = coins;
            this.priceInr = priceInr;
            this.name = name;
        }

        public String getId() { return id; }
        public int getCoins() { return coins; }
        public int getPriceInr() { return priceInr; }
        public int getAmountPaise() { return priceInr * 100; }
        public String getName() { return name; }
    }

    private static final Map<String, CoinPackage> OFFICIAL_PACKAGES = new LinkedHashMap<>();

    static {
        // Standard MIORA Coin Packages
        OFFICIAL_PACKAGES.put("coins_100", new CoinPackage("coins_100", 100, 49, "100 MIORA Coins"));
        OFFICIAL_PACKAGES.put("coins_250", new CoinPackage("coins_250", 250, 99, "250 MIORA Coins"));
        OFFICIAL_PACKAGES.put("coins_600", new CoinPackage("coins_600", 600, 199, "600 MIORA Coins"));
        OFFICIAL_PACKAGES.put("coins_1500", new CoinPackage("coins_1500", 1500, 399, "1500 MIORA Coins"));

        // Existing legacy UI packages support
        OFFICIAL_PACKAGES.put("pkg_12", new CoinPackage("pkg_12", 100, 12, "Quick Start Pack"));
        OFFICIAL_PACKAGES.put("pkg_29", new CoinPackage("pkg_29", 270, 29, "Most Popular Pack"));
        OFFICIAL_PACKAGES.put("pkg_59", new CoinPackage("pkg_59", 600, 59, "Great Value Pack"));
        OFFICIAL_PACKAGES.put("pkg_99", new CoinPackage("pkg_99", 1120, 99, "Romance Pack"));
        OFFICIAL_PACKAGES.put("pkg_199", new CoinPackage("pkg_199", 2500, 199, "VIP Lover Pack"));
    }

    public RazorpayService(FirestoreService firestoreService, ObjectMapper objectMapper) {
        this.firestoreService = firestoreService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public CoinPackage getPackage(String packageId) {
        if (packageId == null) return null;
        return OFFICIAL_PACKAGES.get(packageId.trim().toLowerCase());
    }

    public List<CoinPackage> getAllPackages() {
        return new ArrayList<>(OFFICIAL_PACKAGES.values());
    }

    /**
     * Creates an authentic Razorpay Order on the Razorpay Server using TEST credentials.
     * Never exposes keySecret.
     */
    public CreateOrderResponse createOrder(String userId, String packageId) {
        CoinPackage pkg = getPackage(packageId);
        if (pkg == null) {
            throw new IllegalArgumentException("Invalid coin package ID: " + packageId);
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
            notes.put("packageId", pkg.getId());
            notes.put("coins", String.valueOf(pkg.getCoins()));
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
                log.info("Successfully created Razorpay TEST Order: {} for user: {} (Package: {}, Amount: ₹{})",
                        orderId, userId, pkg.getId(), pkg.getPriceInr());

                return CreateOrderResponse.builder()
                        .orderId(orderId)
                        .amount(amountPaise)
                        .amountInr(pkg.getPriceInr())
                        .currency("INR")
                        .keyId(keyId.trim()) // Safe public Key ID for Razorpay Checkout
                        .packageId(pkg.getId())
                        .coins(pkg.getCoins())
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
     * ONLY after verification succeeds, credits coins to the user's wallet with IDEMPOTENCY guarantee.
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
            throw new IllegalArgumentException("Invalid package ID during verification: " + packageId);
        }

        // 1. Cryptographic HMAC-SHA256 Signature Verification
        boolean isValidSignature = verifyHmacSha256(razorpayOrderId.trim(), razorpayPaymentId.trim(), razorpaySignature.trim(), keySecret.trim());
        if (!isValidSignature) {
            log.warn("SECURITY ALERT: Invalid Razorpay signature attempt for Order: {}, Payment: {}, User: {}",
                    razorpayOrderId, razorpayPaymentId, userId);
            throw new SecurityException("Cryptographic payment signature verification failed. Untrusted payment details.");
        }

        log.info("Cryptographic Razorpay payment signature verified for Order: {}, Payment: {}", razorpayOrderId, razorpayPaymentId);

        // 2. IDEMPOTENCY CHECK: Ensure the same payment ID or order ID is NEVER credited more than once
        if (processedPaymentIds.contains(razorpayPaymentId) || processedOrderIds.contains(razorpayOrderId)) {
            log.info("Idempotency: Payment {} / Order {} was already processed. Returning current balance.", razorpayPaymentId, razorpayOrderId);
            User currentUser = firestoreService.getUser(userId);
            return PaymentVerificationResponse.builder()
                    .success(true)
                    .message("Payment already verified and credited.")
                    .newBalance(currentUser != null ? currentUser.getCoinBalance() : 0)
                    .coinsAdded(0)
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayPaymentId(razorpayPaymentId)
                    .build();
        }

        // Check persistent Firestore transactions for duplicate payment ID
        List<CoinTransaction> existingTxs = firestoreService.getTransactions(userId);
        boolean alreadyInFirestore = existingTxs.stream()
                .anyMatch(tx -> razorpayPaymentId.equals(tx.getRazorpayPaymentId()) || razorpayOrderId.equals(tx.getRazorpayOrderId()));

        if (alreadyInFirestore) {
            log.info("Idempotency: Found existing transaction in Firestore for payment {}. Skipping duplicate credit.", razorpayPaymentId);
            processedPaymentIds.add(razorpayPaymentId);
            processedOrderIds.add(razorpayOrderId);
            User currentUser = firestoreService.getUser(userId);
            return PaymentVerificationResponse.builder()
                    .success(true)
                    .message("Payment already verified and credited in Firestore.")
                    .newBalance(currentUser != null ? currentUser.getCoinBalance() : 0)
                    .coinsAdded(0)
                    .razorpayOrderId(razorpayOrderId)
                    .razorpayPaymentId(razorpayPaymentId)
                    .build();
        }

        // 3. ATOMIC COIN CREDITING
        User user = firestoreService.getUser(userId);
        int currentBalance = user != null ? user.getCoinBalance() : 0;
        int newBalance = currentBalance + pkg.getCoins();

        if (user != null) {
            user.setCoinBalance(newBalance);
            firestoreService.saveUser(user);
        }

        // 4. RECORD COMPREHENSIVE TRANSACTION RECORD
        CoinTransaction tx = CoinTransaction.builder()
                .id("tx_" + razorpayPaymentId)
                .userId(userId)
                .type("PURCHASE")
                .amount(pkg.getCoins())
                .coins(pkg.getCoins())
                .amountInr(pkg.getPriceInr())
                .currency("INR")
                .description("Purchased " + pkg.getCoins() + " MIORA Coins (₹" + pkg.getPriceInr() + ")")
                .timestamp("Just now")
                .createdAt(Instant.now().toString())
                .category("purchase")
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .status("SUCCESS")
                .build();

        firestoreService.addTransaction(tx);

        // Mark as processed in idempotency tracker
        processedPaymentIds.add(razorpayPaymentId);
        processedOrderIds.add(razorpayOrderId);

        log.info("SUCCESS: Credited {} coins to user {}. New Balance: {} (Tx: {})",
                pkg.getCoins(), userId, newBalance, tx.getId());

        return PaymentVerificationResponse.builder()
                .success(true)
                .message("Payment verified successfully! " + pkg.getCoins() + " MIORA Coins have been credited.")
                .newBalance(newBalance)
                .coinsAdded(pkg.getCoins())
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
