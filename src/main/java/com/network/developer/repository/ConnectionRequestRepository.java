package com.network.developer.repository;

import com.network.developer.entity.ConnectionRequest;
import com.network.developer.entity.ConnectionRequestStatus;
import com.network.developer.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    // Check if any request exists between two users in either direction
    @Query("""
        SELECT cr FROM ConnectionRequest cr
        WHERE (cr.sender.id = :u1 AND cr.receiver.id = :u2)
           OR (cr.sender.id = :u2 AND cr.receiver.id = :u1)
    """)
    Optional<ConnectionRequest> findExistingRequest(
            @Param("u1") Long userOneId,
            @Param("u2") Long userTwoId
    );

    // List all incoming pending requests for a user
List<ConnectionRequest> findAllByReceiverIdAndStatus(Long receiverId, ConnectionRequestStatus status);

    // Feed / Suggestions query: Exclude self, and any user where a PENDING or ACCEPTED request already exists
    @Query("""
        SELECT u FROM User u
        WHERE u.id <> :currentUserId
        AND u.id NOT IN (
            SELECT cr.receiver.id FROM ConnectionRequest cr
            WHERE cr.sender.id = :currentUserId 
              AND cr.status IN ('PENDING', 'ACCEPTED')
        )
        AND u.id NOT IN (
            SELECT cr.sender.id FROM ConnectionRequest cr 
            WHERE cr.receiver.id = :currentUserId 
              AND cr.status IN ('PENDING', 'ACCEPTED')
        )
    """)
    Page<User> findPotentialConnections(@Param("currentUserId") Long currentUserId, Pageable pageable);
}