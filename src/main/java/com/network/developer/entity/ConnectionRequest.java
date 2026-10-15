package com.network.developer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "connection_requests",
        uniqueConstraints = {
                @UniqueConstraint(
                name = "uk_connection_sender_receiver",
                columnNames = {"sender_id", "receiver_id"}) //-> Responsible for The same sender cannot create another connection request to the same receiver.
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    //With lazy loading, Hibernate doesn't necessarily immediately fetch the complete sender object.Hibernate may fetch the sender.
    //"A ConnectionRequest belongs to one sender, and many connection requests can have the same sender."
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    //"A ConnectionRequest belongs to one sender, and many connection requests can have the same sender."
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionRequestStatus status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}