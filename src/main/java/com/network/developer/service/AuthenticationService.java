package com.network.developer.service;

import com.network.developer.dto.auth.AuthenticationRequest;
import com.network.developer.dto.auth.AuthenticationResponse;
import com.network.developer.dto.auth.RegisterRequest;
import com.network.developer.entity.Role;
import com.network.developer.entity.User; // 1. Fixed Import to your custom Entity
import com.network.developer.repository.UserRepository;
import com.network.developer.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // 2. Build your custom user entity
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail()) // Fixed typo (.getLastName -> .getEmail)
                .password(passwordEncoder.encode(request.getPassword())) // Fixed encoder syntax
                .role(Role.USER)
                .build();

        repository.save(user); // Save to database

        var jwtToken = jwtService.generateToken(user);
        // 3. Return a response (Placeholder token until JwtService is connected)
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        return null;
    }
}
