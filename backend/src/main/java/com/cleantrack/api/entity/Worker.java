package com.cleantrack.api.entity;

import com.cleantrack.api.enums.ShiftStatus;
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
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cleaning_center_id")
    private CleaningCenter cleaningCenter;

    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_status", nullable = false)
    @Builder.Default
    private ShiftStatus shiftStatus = ShiftStatus.OFF_DUTY;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private boolean isAvailable = true;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "tasks_completed", nullable = false)
    @Builder.Default
    private int tasksCompleted = 0;

    @Column(name = "avg_rating", nullable = false)
    @Builder.Default
    private double avgRating = 0.0;

    @Column(name = "last_active_at")
    private Instant lastActiveAt;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
