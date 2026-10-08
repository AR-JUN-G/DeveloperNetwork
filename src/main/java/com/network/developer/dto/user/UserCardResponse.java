package com.network.developer.dto.user;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCardResponse {
    private long id;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
}
