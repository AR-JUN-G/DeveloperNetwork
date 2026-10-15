package com.network.developer.dto.chat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatHistoryRequest {
    @NotNull(message = "Receiver Id is required")
    private Long otherUserId;

    private LocalDateTime lastSeenTime;

    private Long lastSeenId;
}
