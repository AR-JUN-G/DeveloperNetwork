package com.network.developer.controller;


import com.network.developer.dto.user.UpdateProfileRequest;
import com.network.developer.dto.user.UpdateProfileResponse;
import com.network.developer.dto.user.UserProfileResponse;
import com.network.developer.entity.User;
import com.network.developer.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {
    public final UserService userService;


    @PatchMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UpdateProfileResponse> updateProfile(
            @Valid @ModelAttribute UpdateProfileRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(userService.updateProfile(currentUser, request));
    }


    @GetMapping(value = "/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }



}
