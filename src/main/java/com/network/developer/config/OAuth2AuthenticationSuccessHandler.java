package com.network.developer.config;

import com.network.developer.entity.AuthProvider;
import com.network.developer.entity.Role;
import com.network.developer.entity.User;
import com.network.developer.repository.UserRepository;
import com.network.developer.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.rmi.ServerException;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final UserRepository userRepository;


    @Value("${jwt.cookie-name:jwt}")
    private String cookieName;

    @Value("${jwt.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${app.oauth2.redirect-uri:http://localhost:5173}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServerException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        Object providerIdAttribute = oAuth2User.getAttribute("id");

        String providerId = providerIdAttribute != null
                ? providerIdAttribute.toString()
                : null;
        String login = oAuth2User.getAttribute("login");
        String fullName = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String avatarUrl = oAuth2User.getAttribute("avatar_url");

        // 2. Handle GitHub users who hide their public email address
        if (email == null || email.isBlank()) {
            email = login + "@users.noreply.github.com";
        }

        // 3. Parse firstName and lastName from GitHub's 'name' (or fallback to 'login')
        String firstName = login;
        String lastName = "";
        if (fullName != null && !fullName.isBlank()) {
            String[] parts = fullName.trim().split("\\s+", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : "";
        }

        final String finalEmail = email;
        final String finalFirstName = firstName;
        final String finalLastName = lastName;


        User user = userRepository.findByEmail(finalEmail)
                .map(existingUser -> {
                    existingUser.setProvider(AuthProvider.GITHUB);
                    existingUser.setProviderId(providerId);
                    if (avatarUrl != null && !avatarUrl.isBlank()) {
                        existingUser.setProfileImageUrl(avatarUrl);
                    }
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .firstName(finalFirstName)
                            .lastName(finalLastName)
                            .email(finalEmail)
                            .profileImageUrl(avatarUrl)
                            .provider(AuthProvider.GITHUB)
                            .providerId(providerId)
                            .role(Role.USER)
                            .build();
                    return userRepository.save(newUser);
                });


        String jwtToken = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from(cookieName, jwtToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        getRedirectStrategy().sendRedirect(request,response,frontendRedirectUri);

    }
}
