package com.network.developer.service;


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
    public List<ChatMessageResponse> getChatHistory(User currentUser, Long otherUserId, int page, int size) {
        return chatMessageRepository.findChatHistory(currentUser.getId(), otherUserId, PageRequest.of(page, size))
                .getContent()
                .stream()
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
