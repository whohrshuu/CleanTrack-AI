package com.cleantrack.api.dto;

import com.cleantrack.api.entity.Worker;
import java.time.Instant;

public record WorkerResponse(
        Long id,
        Long userId,
        String fullName,
        String employeeId,
        String centerName,
        String shiftStatus,
        boolean isAvailable,
        Double currentLatitude,
        Double currentLongitude,
        int tasksCompleted,
        double avgRating,
        Instant lastActiveAt
) {
    public static WorkerResponse from(Worker w) {
        return new WorkerResponse(
                w.getId(),
                w.getUser().getId(),
                w.getUser().getFullName(),
                w.getEmployeeId(),
                w.getCleaningCenter() != null ? w.getCleaningCenter().getName() : null,
                w.getShiftStatus().name(),
                w.getIsAvailable(),
                w.getCurrentLatitude(),
                w.getCurrentLongitude(),
                w.getTasksCompleted(),
                w.getAvgRating(),
                w.getLastActiveAt()
        );
    }
}
