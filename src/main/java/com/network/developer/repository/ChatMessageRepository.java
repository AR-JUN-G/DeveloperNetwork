package com.network.developer.repository;

import com.network.developer.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("""
            SELECT m FROM ChatMessage m
            WHERE (
                (m.sender.id = :userAId AND m.receiver.id = :userBId)
                OR
                (m.sender.id = :userBId AND m.receiver.id = :userAId)
            )
            AND (
                m.createdAt < :lastSeenTime
                OR (
                    m.createdAt = :lastSeenTime
                    AND m.id < :lastSeenId
                )
            )
            ORDER BY m.createdAt DESC, m.id DESC
            """)
    List<ChatMessage> findOlderMessages(
            @Param("userAId") Long userAId,
            @Param("userBId") Long userBId,
            @Param("lastSeenTime") LocalDateTime lastSeenTime,
            @Param("lastSeenId") Long lastSeenId,
            Pageable pageable
    );


    @Query("""
            SELECT m FROM ChatMessage m
            WHERE (
                (m.sender.id = :userAId AND m.receiver.id = :userBId)
                OR
                (m.sender.id = :userBId AND m.receiver.id = :userAId)
            )
            ORDER BY m.createdAt DESC, m.id DESC
            """)
    List<ChatMessage> findLatestMessages(
            @Param("userAId") Long userAId,
            @Param("userBId") Long userBId,
            Pageable pageable
    );
}
