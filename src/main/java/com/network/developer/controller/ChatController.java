package com.network.developer.controller;

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

    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<List<ChatMessageResponse>> getHistory(
            @PathVariable Long otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(chatService.getChatHistory(currentUser, otherUserId, page, size));
    }

}
