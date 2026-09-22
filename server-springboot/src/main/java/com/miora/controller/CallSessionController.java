package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.model.CallSession;
import com.miora.security.SecurityUtils;
import com.miora.service.CallSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/call-session")
public class CallSessionController {

    private final CallSessionService callSessionService;

    public CallSessionController(CallSessionService callSessionService) {
        this.callSessionService = callSessionService;
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<CallSession>> startCall(@RequestBody Map<String, String> request) {
        String callerId = SecurityUtils.getCurrentUserId();
        String receiverId = request.get("receiverId");
        String callType = request.getOrDefault("callType", "audio");

        try {
            CallSession session = callSessionService.startCallSession(callerId, receiverId, callType);
            return ResponseEntity.ok(ApiResponse.ok("Call session initiated successfully", session));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to start call session: " + e.getMessage()));
        }
    }

    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<CallSession>> connectCall(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        try {
            CallSession session = callSessionService.connectCallSession(sessionId);
            return ResponseEntity.ok(ApiResponse.ok("Call session connected", session));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<ApiResponse<CallSession>> rejectCall(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String status = request.getOrDefault("status", "REJECTED");
        CallSession session = callSessionService.rejectOrMissCallSession(sessionId, status);
        return ResponseEntity.ok(ApiResponse.ok("Call session rejected and reservation refunded", session));
    }

    @PostMapping("/end")
    public ResponseEntity<ApiResponse<CallSession>> endCall(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        CallSession session = callSessionService.endCallSession(sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Call session ended", session));
    }

    @GetMapping("/status/{sessionId}")
    public ResponseEntity<ApiResponse<CallSession>> getStatus(@PathVariable("sessionId") String sessionId) {
        CallSession session = callSessionService.getCallSession(sessionId);
        if (session == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok(session));
    }
}
