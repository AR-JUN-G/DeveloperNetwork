package com.network.developer.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileResponse {
    private int status;
    private String message;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
}
