package com.cleantrack.api.entity;

import com.cleantrack.api.enums.EscalationLevel;
import com.cleantrack.api.enums.EscalationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "escalations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Escalation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escalated_by_id", nullable = false)
    private User escalatedBy;

    @Column(name = "escalated_to_name")
    private String escalatedToName;

    @Enumerated(EnumType.STRING)
    @Column(name = "escalation_level", nullable = false)
    private EscalationLevel escalationLevel;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EscalationStatus status = EscalationStatus.OPEN;

    @Column(name = "escalated_at", updatable = false)
    private Instant escalatedAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.escalatedAt = Instant.now();
    }
}
