package com.network.developer.controller;

import com.network.developer.dto.chat.ChatHistoryRequest;
import com.network.developer.dto.chat.ChatMessageRequest;
import com.network.developer.dto.chat.ChatMessageResponse;
import com.network.developer.entity.User;
import com.network.developer.service.ChatService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@AllArgsConstructor
public class ChatController {
    public final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(@AuthenticationPrincipal User currentUser,
                                                           @Valid @RequestBody ChatMessageRequest payload) {
        return ResponseEntity.ok(chatService.sendMessage(currentUser, payload));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageResponse>> getHistory(
            @ModelAttribute ChatHistoryRequest queryParams,
            @RequestBody(required = false) ChatHistoryRequest bodyParams,
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "30") int size
    ) {
        ChatHistoryRequest requestBody = (bodyParams != null && bodyParams.getOtherUserId() != null)
                ? bodyParams
                : queryParams;

        if (requestBody == null || requestBody.getOtherUserId() == null) {
            throw new IllegalArgumentException("Receiver Id is required");
        }

        return ResponseEntity.ok(chatService.getOlderMessage(currentUser, requestBody, size));
    }

}
