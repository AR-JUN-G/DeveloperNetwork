package com.network.developer.controller;

import com.network.developer.dto.chat.ChatMessageRequest;
import com.network.developer.entity.User;
import com.network.developer.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebsocketController {

    private final ChatService chatService;
    @MessageMapping("/chat.send")
    public void processMessage(
            @Payload ChatMessageRequest payload,
            @AuthenticationPrincipal User currentUser) {

        chatService.sendMessage(currentUser, payload);
    }
}
