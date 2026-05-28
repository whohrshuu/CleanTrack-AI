package com.cleantrack.api.repository;

import com.cleantrack.api.entity.Worker;
import com.cleantrack.api.enums.ShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByUserId(Long userId);
    List<Worker> findByCleaningCenterId(Long centerId);
    List<Worker> findByIsAvailableTrue();
    List<Worker> findByShiftStatus(ShiftStatus status);
}
