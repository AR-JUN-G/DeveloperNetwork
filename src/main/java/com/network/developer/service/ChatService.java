package com.network.developer.service;


import com.network.developer.dto.chat.ChatHistoryRequest;
import com.network.developer.dto.chat.ChatMessageRequest;
import com.network.developer.dto.chat.ChatMessageResponse;
import com.network.developer.entity.ChatMessage;
import com.network.developer.entity.ConnectionRequestStatus;
import com.network.developer.entity.User;
import com.network.developer.repository.ChatMessageRepository;
import com.network.developer.repository.ConnectionRequestRepository;
import com.network.developer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;


    public ChatMessageResponse sendMessage(User sender, ChatMessageRequest payload) {
        User receiver = userRepository.findById(payload.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        boolean isConnected = connectionRequestRepository.findExistingRequest(sender.getId(), receiver.getId())
                .map(r -> r.getStatus() == ConnectionRequestStatus.ACCEPTED)
                .orElse(false);

        if (!isConnected) {
            throw new IllegalStateException("You can only message accepted connections");
        }

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(payload.getContent())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        ChatMessageResponse response = ChatMessageResponse.builder()
                .id(savedMessage.getId())
                .senderId(savedMessage.getSender().getId())
                .receiverId(savedMessage.getReceiver().getId())
                .content(savedMessage.getContent())
                .createdAt(savedMessage.getCreatedAt())
                .build();

        simpMessagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/message",
                response
        );

        return response;
    }


    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getOlderMessage(User currentUser, ChatHistoryRequest requestBody, int size) {
        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Message size must be between 1 and 100"
            );
        }

        Long otherUserId = requestBody.getOtherUserId();
        LocalDateTime lastSeenTime = requestBody.getLastSeenTime();
        Long lastSeenId = requestBody.getLastSeenId();

        if (otherUserId == null) {
            throw new IllegalArgumentException("Receiver Id is required");
        }

        // Whether the both field should be provided or it should be provided
        if ((lastSeenTime == null) != (lastSeenId == null)) {
            throw new IllegalArgumentException("Both cursor fields must be provided together");
        }


        User otherUser = userRepository.findById(otherUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));


        boolean isConnected = connectionRequestRepository.findExistingRequest(
                        currentUser.getId(),
                        otherUser.getId()
                )
                .map(request ->
                        request.getStatus() == ConnectionRequestStatus.ACCEPTED)
                .orElse(false);

        if (!isConnected) {
            throw new IllegalStateException(
                    "You can only view chat history with accepted connections"
            );
        }

        // Always query the newest batch first.
        PageRequest pageable = PageRequest.of(0, size);

        List<ChatMessage> messages;

        if (lastSeenTime == null) {
            // Initial request: fetch the latest messages.
            messages = chatMessageRepository.findLatestMessages(
                    currentUser.getId(),
                    otherUserId,
                    pageable
            );
        } else {
            // Subsequent request: fetch messages older than the cursor.
            messages = chatMessageRepository.findOlderMessages(
                    currentUser.getId(),
                    otherUserId,
                    lastSeenTime,
                    lastSeenId,
                    pageable
            );
        }

        // The database returns newest-first.
        // Return each batch in chronological order.
        List<ChatMessage> chronologicalMessages =
                new java.util.ArrayList<>(messages);

        java.util.Collections.reverse(chronologicalMessages);

        return chronologicalMessages.stream()
                .map(msg -> ChatMessageResponse.builder()
                        .id(msg.getId())
                        .senderId(msg.getSender().getId())
                        .receiverId(msg.getReceiver().getId())
                        .content(msg.getContent())
                        .createdAt(msg.getCreatedAt())
                        .build())
                .toList();
    }
}
