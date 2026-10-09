package com.network.developer.controller;


import com.network.developer.dto.connection.ReviewRequestResponse;
import com.network.developer.dto.connection.SendConnectionRequestResponse;
import com.network.developer.dto.user.UserCardResponse;
import com.network.developer.entity.User;
import com.network.developer.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/connection")
@RequiredArgsConstructor
public class ConnectionController {
    public final ConnectionService connectionService;


    @PostMapping("/send/{receiverId}")
    public ResponseEntity<SendConnectionRequestResponse> sendRequest(
            @PathVariable Long receiverId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(connectionService.sendRequest(currentUser, receiverId));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<UserCardResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(connectionService.getSuggestionFeed(currentUser, page, size));
    }

    @GetMapping("/requests/received")
    public ResponseEntity<List<UserCardResponse>> getReceivedRequests(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(connectionService.getReceivedRequests(currentUser));
    }


    @PostMapping("/requests/{requestId}/review")
    public ResponseEntity<ReviewRequestResponse> reviewRequest(
            @PathVariable Long requestId,
            @RequestParam String action, // "ACCEPT" or "REJECT"
            @AuthenticationPrincipal User currentUser
    ) {

        return ResponseEntity.ok(connectionService.reviewRequest(currentUser, requestId, action));
    }
}
