package com.network.developer.service;

import com.network.developer.dto.user.UpdateProfileRequest;
import com.network.developer.dto.user.UpdateProfileResponse;
import com.network.developer.dto.user.UserProfileResponse;
import com.network.developer.entity.User;
import com.network.developer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;




@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public UpdateProfileResponse updateProfile(User currentUser, UpdateProfileRequest request) {

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            currentUser.setFirstName(request.getFirstName().trim());
        }

        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            currentUser.setLastName(request.getLastName().trim());
        }

        if (request.getProfileImage() != null && !request.getProfileImage().isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(request.getProfileImage());
            currentUser.setProfileImageUrl(imageUrl);
        }

        User updatedUser = userRepository.save(currentUser);

        return UpdateProfileResponse.builder()
                .status(HttpStatus.OK.value())
                .message("User Updated")
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .profileImageUrl(updatedUser.getProfileImageUrl()).build();
    }


    public UserProfileResponse getProfile(User currentUser) {
        User user = (User) userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUser.getEmail()));

        return UserProfileResponse.builder()
                .status(200)
                .message("User fetched Successfully")
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

}
