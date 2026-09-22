package com.miora.service;

import com.miora.model.CallSession;
import com.miora.model.CoinTransaction;
import com.miora.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CallSessionService {

    private static final Logger log = LoggerFactory.getLogger(CallSessionService.class);

    private final FirestoreService firestoreService;
    private final Map<String, CallSession> activeCallSessions = new ConcurrentHashMap<>();

    public CallSessionService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    /**
     * Initiates a paid call session (Audio ₹79/5m, Video ₹79/2m).
     * Atomically verifies and reserves ₹79 from caller's wallet balance.
     */
    public synchronized CallSession startCallSession(String callerId, String receiverId, String callType) {
        if (callerId == null || receiverId == null) {
            throw new IllegalArgumentException("Caller and Receiver IDs are required.");
        }
        if (callerId.equals(receiverId)) {
            throw new IllegalArgumentException("Cannot initiate call session with self.");
        }

        // Verify Safety & Blocks
        List<String> blockedIds = firestoreService.getBlockedProfileIds(callerId);
        if (blockedIds.contains(receiverId)) {
            throw new SecurityException("Cannot initiate call with a blocked profile.");
        }

        String type = "video".equalsIgnoreCase(callType) ? "video" : "audio";
        int maxDuration = "video".equals(type) ? 120 : 300; // 2 mins for video, 5 mins for audio

        User caller = firestoreService.getUser(callerId);
        String tier = caller != null && caller.getSubscriptionTier() != null ? caller.getSubscriptionTier().toLowerCase() : "free";

        double cost = 0.0;
        boolean isIncludedInPlan = false;

        if ("vip".equals(tier)) {
            cost = 0.0;
            isIncludedInPlan = true;
        } else if ("pro".equals(tier)) {
            if ("audio".equals(type) && caller.getDailyAudioCallsRemaining() != null && caller.getDailyAudioCallsRemaining() > 0) {
                cost = 0.0;
                isIncludedInPlan = true;
                caller.setDailyAudioCallsRemaining(caller.getDailyAudioCallsRemaining() - 1);
            } else if ("video".equals(type) && caller.getDailyVideoCallsRemaining() != null && caller.getDailyVideoCallsRemaining() > 0) {
                cost = 0.0;
                isIncludedInPlan = true;
                caller.setDailyVideoCallsRemaining(caller.getDailyVideoCallsRemaining() - 1);
            } else {
                cost = 79.0;
            }
        } else {
            // FREE Tier
            if ("audio".equals(type)) {
                if (caller.getDailyAudioCallsRemaining() != null && caller.getDailyAudioCallsRemaining() <= 0) {
                    throw new IllegalArgumentException("You have reached your daily audio call limit (10 calls/day). Upgrade to PRO or VIP for more calls!");
                }
                if (caller != null && caller.getDailyAudioCallsRemaining() != null) {
                    caller.setDailyAudioCallsRemaining(caller.getDailyAudioCallsRemaining() - 1);
                }
            } else {
                if (caller.getDailyVideoCallsRemaining() != null && caller.getDailyVideoCallsRemaining() <= 0) {
                    throw new IllegalArgumentException("You have reached your daily video call limit (3 calls/day). Upgrade to PRO or VIP for more calls!");
                }
                if (caller != null && caller.getDailyVideoCallsRemaining() != null) {
                    caller.setDailyVideoCallsRemaining(caller.getDailyVideoCallsRemaining() - 1);
                }
            }
            cost = 79.0;
        }

        double currentBalance = (caller != null && caller.getWalletBalance() != null) ? caller.getWalletBalance() : 0.0;

        if (cost > 0.0) {
            if (currentBalance < cost) {
                throw new IllegalArgumentException("Insufficient wallet balance for " + type + " call package (₹" + (int) cost + "). Wallet Balance: ₹" + (int) currentBalance);
            }
            // Reserve cost from caller's wallet balance
            caller.setWalletBalance(currentBalance - cost);
        }

        if (caller != null) {
            firestoreService.saveUser(caller);
        }

        String sessionId = "call_" + UUID.randomUUID().toString().substring(0, 10);
        long now = Instant.now().getEpochSecond();

        CallSession session = CallSession.builder()
                .id(sessionId)
                .callerId(callerId)
                .receiverId(receiverId)
                .callType(type)
                .status("CREATED")
                .costAmount(cost)
                .maxDurationSeconds(maxDuration)
                .createdAt(now)
                .connectedAt(0L)
                .expiresAt(0L)
                .endedAt(0L)
                .isRefunded(false)
                .channelName("miora_channel_" + sessionId)
                .build();

        activeCallSessions.put(sessionId, session);

        if (cost > 0.0) {
            // Record Reservation Transaction
            CoinTransaction tx = CoinTransaction.builder()
                    .id("tx_" + sessionId)
                    .userId(callerId)
                    .type(type.toUpperCase() + "_CALL_RESERVATION")
                    .amount((int) -cost)
                    .walletAmount(-cost)
                    .balanceBefore(currentBalance)
                    .balanceAfter(currentBalance - cost)
                    .description("Reserved ₹" + (int) cost + " for " + type + " call package (" + (maxDuration / 60) + " mins)")
                    .timestamp("Just now")
                    .createdAt(Instant.now().toString())
                    .status("RESERVED")
                    .build();
            firestoreService.addTransaction(tx);
        }

        log.info("Call Session Started: {} by user {} (Tier: {}, Cost: ₹{}, Included: {})",
                sessionId, callerId, tier, cost, isIncludedInPlan);
        return session;
    }

    /**
     * Triggered when receiver accepts call and WebRTC state reaches CONNECTED.
     * Starts the official package timer with server-authoritative expiresAt.
     */
    public synchronized CallSession connectCallSession(String sessionId) {
        CallSession session = activeCallSessions.get(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Call session not found: " + sessionId);
        }

        long now = Instant.now().getEpochSecond();
        session.setStatus("CONNECTED");
        session.setConnectedAt(now);
        session.setExpiresAt(now + session.getMaxDurationSeconds());

        if (session.getCostAmount() > 0.0) {
            CoinTransaction captureTx = CoinTransaction.builder()
                    .id("tx_cap_" + sessionId)
                    .userId(session.getCallerId())
                    .type(session.getCallType().toUpperCase() + "_CALL")
                    .amount((int) -session.getCostAmount())
                    .walletAmount(-session.getCostAmount())
                    .description(session.getCallType().toUpperCase() + " Call Package: ₹" + (int) session.getCostAmount() + " (" + (session.getMaxDurationSeconds() / 60) + " mins)")
                    .timestamp("Just now")
                    .createdAt(Instant.now().toString())
                    .status("SUCCESS")
                    .build();
            firestoreService.addTransaction(captureTx);
        }

        log.info("Call Session CONNECTED: {}. Authoritative expiresAt: {}", sessionId, session.getExpiresAt());
        return session;
    }

    /**
     * Triggered if call is REJECTED, MISSED, or fails before CONNECTED.
     * Idempotently releases/refunds the reserved ₹79 back to caller's wallet.
     */
    public synchronized CallSession rejectOrMissCallSession(String sessionId, String status) {
        CallSession session = activeCallSessions.get(sessionId);
        if (session == null) {
            return null;
        }

        String finalStatus = "REJECTED".equalsIgnoreCase(status) ? "REJECTED" : "MISSED";
        session.setStatus(finalStatus);
        session.setEndedAt(Instant.now().getEpochSecond());

        // Idempotent refund release if not already refunded and never connected
        if (!session.isRefunded() && session.getConnectedAt() == 0L) {
            session.setRefunded(true);
            User caller = firestoreService.getUser(session.getCallerId());
            if (caller != null) {
                double currentBal = caller.getWalletBalance() != null ? caller.getWalletBalance() : 0.0;
                caller.setWalletBalance(currentBal + session.getCostAmount());
                firestoreService.saveUser(caller);

                // Record Refund Ledger Transaction
                CoinTransaction tx = CoinTransaction.builder()
                        .id("tx_refund_" + sessionId)
                        .userId(session.getCallerId())
                        .type("REFUND")
                        .amount((int) session.getCostAmount())
                        .description("Refunded ₹" + (int) session.getCostAmount() + " for " + finalStatus.toLowerCase() + " call session")
                        .timestamp("Just now")
                        .createdAt(Instant.now().toString())
                        .status("SUCCESS")
                        .build();
                firestoreService.addTransaction(tx);

                log.info("Call Session {} {}: Released/Refunded ₹{} back to user {}", sessionId, finalStatus, session.getCostAmount(), session.getCallerId());
            }
        }

        return session;
    }

    /**
     * Normal termination of connected call by user.
     */
    public synchronized CallSession endCallSession(String sessionId) {
        CallSession session = activeCallSessions.get(sessionId);
        if (session == null) {
            return null;
        }

        session.setStatus("ENDED");
        session.setEndedAt(Instant.now().getEpochSecond());
        return session;
    }

    /**
     * Returns current active call session status.
     * Evaluates server-authoritative expiresAt to auto-end call when 00:00 is reached.
     */
    public CallSession getCallSession(String sessionId) {
        CallSession session = activeCallSessions.get(sessionId);
        if (session == null) {
            return null;
        }

        long now = Instant.now().getEpochSecond();
        if ("CONNECTED".equals(session.getStatus()) && session.getExpiresAt() > 0 && now >= session.getExpiresAt()) {
            synchronized (this) {
                session.setStatus("EXPIRED");
                session.setEndedAt(now);
                log.info("Call Session {} EXPIRED at 00:00 (expiresAt: {})", sessionId, session.getExpiresAt());
            }
        }

        return session;
    }
}
