package com.miora.service;

import com.miora.model.CallSession;
import com.miora.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CallSessionServiceTest {

    private FirestoreService firestoreService;
    private CallSessionService callSessionService;

    @BeforeEach
    void setUp() {
        firestoreService = Mockito.mock(FirestoreService.class);
        callSessionService = new CallSessionService(firestoreService);
    }

    @Test
    void testStartAudioCallSession_Success_Reserves79Rupees() {
        User caller = User.builder().id("user1").name("Alice").walletBalance(150.0).build();
        when(firestoreService.getUser("user1")).thenReturn(caller);

        CallSession session = callSessionService.startCallSession("user1", "user2", "audio");

        assertNotNull(session);
        assertEquals("CREATED", session.getStatus());
        assertEquals("audio", session.getCallType());
        assertEquals(79.0, session.getCostAmount());
        assertEquals(300, session.getMaxDurationSeconds());
        assertEquals(71.0, caller.getWalletBalance());
        verify(firestoreService, times(1)).saveUser(caller);
    }

    @Test
    void testStartVideoCallSession_Success_Reserves79Rupees() {
        User caller = User.builder().id("user1").name("Alice").walletBalance(200.0).build();
        when(firestoreService.getUser("user1")).thenReturn(caller);

        CallSession session = callSessionService.startCallSession("user1", "user2", "video");

        assertNotNull(session);
        assertEquals("CREATED", session.getStatus());
        assertEquals("video", session.getCallType());
        assertEquals(120, session.getMaxDurationSeconds());
        assertEquals(121.0, caller.getWalletBalance());
    }

    @Test
    void testStartCallSession_InsufficientBalance_ThrowsException() {
        User caller = User.builder().id("user1").name("Alice").walletBalance(20.0).build();
        when(firestoreService.getUser("user1")).thenReturn(caller);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            callSessionService.startCallSession("user1", "user2", "audio");
        });

        assertTrue(ex.getMessage().contains("Insufficient wallet balance"));
    }

    @Test
    void testRejectCallSession_RestoresReserved79RupeesIdempotently() {
        User caller = User.builder().id("user1").name("Alice").walletBalance(150.0).build();
        when(firestoreService.getUser("user1")).thenReturn(caller);

        CallSession session = callSessionService.startCallSession("user1", "user2", "audio");
        assertEquals(71.0, caller.getWalletBalance());

        CallSession rejectedSession = callSessionService.rejectOrMissCallSession(session.getId(), "REJECTED");

        assertNotNull(rejectedSession);
        assertEquals("REJECTED", rejectedSession.getStatus());
        assertTrue(rejectedSession.isRefunded());
        assertEquals(150.0, caller.getWalletBalance()); // Refunded back to 150.0

        // Second call to reject should be idempotent and not refund twice
        callSessionService.rejectOrMissCallSession(session.getId(), "REJECTED");
        assertEquals(150.0, caller.getWalletBalance());
    }

    @Test
    void testConnectCallSession_SetsServerAuthoritativeExpiry() {
        User caller = User.builder().id("user1").name("Alice").walletBalance(150.0).build();
        when(firestoreService.getUser("user1")).thenReturn(caller);

        CallSession session = callSessionService.startCallSession("user1", "user2", "audio");
        CallSession connected = callSessionService.connectCallSession(session.getId());

        assertEquals("CONNECTED", connected.getStatus());
        assertTrue(connected.getConnectedAt() > 0);
        assertEquals(connected.getConnectedAt() + 300, connected.getExpiresAt());
    }
}
