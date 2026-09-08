package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.dto.MessageRequest;
import com.miora.model.Message;
import com.miora.security.SecurityUtils;
import com.miora.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<List<Message>>> getMessages(@PathVariable String matchId) {
        String userId = SecurityUtils.getCurrentUserId();
        List<Message> messages = chatService.getMessages(matchId, userId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Message>> sendMessage(@Valid @RequestBody MessageRequest request) {
        String senderId = SecurityUtils.getCurrentUserId();
        Message message = chatService.sendMessage(
                request.getMatchId(),
                senderId,
                request.getText(),
                request.getType(),
                request.getMetadata()
        );
        return ResponseEntity.ok(ApiResponse.ok("Message sent", message));
    }
}
