package com.network.developer.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessagePayload {
    @NotNull
    private Long receiverId;
    @NotBlank
    private String content;
}
