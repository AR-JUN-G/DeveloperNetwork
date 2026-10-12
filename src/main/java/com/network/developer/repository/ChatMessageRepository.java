package com.network.developer.repository;

import com.network.developer.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("""
                    SELECT m from ChatMessage m
                    WHERE (m.sender.id=:userAId AND m.receiver.id=:userBId)
                    OR(m.sender.id = :userBId AND m.receiver.id = :userAId)
                    ORDER BY m.createdAt ASC
            """)
    Page<ChatMessage> findChatHistory(@Param("userAId") Long userAId, @Param("userBId") Long userBId, Pageable page);
}
