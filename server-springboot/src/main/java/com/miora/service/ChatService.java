package com.miora.service;

import com.miora.model.Match;
import com.miora.model.Message;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ChatService {

    private final FirestoreService firestoreService;

    public ChatService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<Message> getMessages(String matchId, String userId) {
        List<String> blockedIds = firestoreService.getBlockedProfileIds(userId);
        List<Message> messages = firestoreService.getMessages(matchId);

        // Filter out any messages from blocked senders
        return messages.stream()
                .filter(m -> !blockedIds.contains(m.getSenderId()))
                .toList();
    }

    public Message sendMessage(String matchId, String senderId, String text, String type, Map<String, Object> metadata) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Message text cannot be blank.");
        }

        // Check block policy
        List<String> blockedIds = firestoreService.getBlockedProfileIds(senderId);
        List<Match> matches = firestoreService.getMatches();
        Match currentMatch = matches.stream().filter(m -> m.getId().equals(matchId)).findFirst().orElse(null);

        if (currentMatch != null && blockedIds.contains(currentMatch.getProfileId())) {
            throw new SecurityException("Cannot send messages to a blocked user.");
        }

        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("h:mm a"));

        Message message = Message.builder()
                .id("msg_" + UUID.randomUUID().toString().substring(0, 8))
                .matchId(matchId)
                .senderId(senderId != null ? senderId : "me")
                .text(text.trim())
                .timestamp(currentTime)
                .read(false)
                .type(type != null ? type : "text")
                .metadata(metadata)
                .build();

        firestoreService.saveMessage(message);

        // Update match last message preview
        if (currentMatch != null) {
            currentMatch.setLastMessage(text.trim());
            currentMatch.setLastMessageTime(currentTime);
            firestoreService.saveMatch(currentMatch);
        }

        return message;
    }
}
