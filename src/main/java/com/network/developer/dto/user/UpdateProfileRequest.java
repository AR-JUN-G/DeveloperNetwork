package com.network.developer.dto.user;


import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    public String firstName;

    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    public String lastName;

    public MultipartFile profileImage;

}
