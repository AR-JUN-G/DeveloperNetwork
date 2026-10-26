package com.network.developer.config;

import com.network.developer.security.WebsocketAuthInterceptor;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebsocketAuthInterceptor authInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // In-memory broker prefix for subscriptions
        registry.enableSimpleBroker("/queue", "/topic");
        // Prefix for messages sent from clients to @MessageMapping controllers
        registry.setApplicationDestinationPrefixes("/app");
        // Prefix for direct user targeting: /user/{username}/queue/...
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:[*]", "http://localhost:5173")
                .withSockJS();

        //For postman
        registry.addEndpoint("/ws-native")
                .setAllowedOriginPatterns("http://*", "https://*");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(authInterceptor);
    }
}

