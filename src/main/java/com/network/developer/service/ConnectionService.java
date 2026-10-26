package com.network.developer.service;

import com.network.developer.dto.connection.ReviewRequestResponse;
import com.network.developer.dto.connection.SendConnectionRequestResponse;
import com.network.developer.dto.user.UserCardResponse;
import com.network.developer.entity.ConnectionRequest;
import com.network.developer.entity.ConnectionRequestStatus;
import com.network.developer.entity.User;
import com.network.developer.repository.ConnectionRequestRepository;
import com.network.developer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public SendConnectionRequestResponse sendRequest(User currentUser, Long receiverId) {
        if (currentUser.getId().equals(receiverId)) {
            throw new IllegalArgumentException("You cannot send Request to Yourself");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + receiverId));


        connectionRequestRepository.findExistingRequest(currentUser.getId(), receiverId)
                .ifPresent(existing -> {
                            if (existing.getStatus() == ConnectionRequestStatus.ACCEPTED) {
                                throw new IllegalStateException("Connection already Made");
                            }
                            throw new IllegalStateException("Connection request already exists between both users");
                        }
                );

        ConnectionRequest request = ConnectionRequest.builder()
                .sender(currentUser)
                .receiver(receiver)
                .status(ConnectionRequestStatus.PENDING)
                .build();

        connectionRequestRepository.save(request);

        return SendConnectionRequestResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Request Send Successfully")
                .build();
    }
 
    @Transactional(readOnly = true)
    public List<UserCardResponse> getSuggestionFeed(User currentUser, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = connectionRequestRepository.findPotentialConnections(currentUser.getId(), pageable);

        return usersPage.getContent().stream().map(user -> UserCardResponse.
                builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImageUrl(user.getProfileImageUrl())
                .build()
        ).toList();
    }


    @Transactional(readOnly = true)
    public List<UserCardResponse> getReceivedRequests(User currentUser) {
        List<ConnectionRequest> requests = connectionRequestRepository.findAllByReceiverIdAndStatus(currentUser.getId(), ConnectionRequestStatus.PENDING);

        // Need to update the UserCardResponse -> Here the id represent the request id. But in the getSuggestionFeed the id represents the user id
        return requests.stream().map(
                req -> UserCardResponse.builder()
                        .id(req.getId())
                        .firstName(req.getSender().getFirstName())
                        .lastName(req.getSender().getLastName())
                        .profileImageUrl(req.getSender().getProfileImageUrl())
                        .build()

        ).toList();
    }

    @Transactional
    public ReviewRequestResponse reviewRequest(User currentUser, Long requestId, String action) {
        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Connection request not Found: " + requestId));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You are not authorized to respond to this request");
        }

        if (request.getStatus() != ConnectionRequestStatus.PENDING) {
            throw new IllegalStateException("This request is already " + request.getStatus());
        }

        if ("ACCEPT".equalsIgnoreCase(action)) {
            request.setStatus(ConnectionRequestStatus.ACCEPTED);
            connectionRequestRepository.save(request);
            return ReviewRequestResponse.builder()
                    .status(HttpStatus.OK.value())
                    .message("Request Accepted Successfully")
                    .build();
        } else if ("REJECT".equalsIgnoreCase(action)) {
            request.setStatus(ConnectionRequestStatus.REJECTED);
            connectionRequestRepository.save(request);
            return ReviewRequestResponse.builder()
                    .status(HttpStatus.OK.value())
                    .message("Request Rejected Successfully")
                    .build();
        } else {
            throw new IllegalArgumentException("Invalid action. Must be ACCEPT or REJECT");
        }
    }

}
