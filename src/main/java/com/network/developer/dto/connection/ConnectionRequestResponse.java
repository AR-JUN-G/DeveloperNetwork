package com.network.developer.dto.connection;


import com.network.developer.entity.ConnectionRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConnectionRequestResponse {

    private Long requestId;
    private Long senderId;
    private Long receiverId;
    private ConnectionRequestStatus status;
    private LocalDateTime createdAt;
}
