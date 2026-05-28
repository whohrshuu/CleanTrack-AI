package com.cleantrack.api.service;

import com.cleantrack.api.dto.WorkerResponse;
import com.cleantrack.api.entity.Worker;
import com.cleantrack.api.enums.ShiftStatus;
import com.cleantrack.api.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerResponse getWorkerByUserId(Long userId) {
        return workerRepository.findByUserId(userId)
                .map(WorkerResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));
    }

    public List<WorkerResponse> getAllWorkers() {
        return workerRepository.findAll().stream()
                .map(WorkerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkerResponse updateShiftStatus(Long workerId, ShiftStatus status) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));
        worker.setShiftStatus(status);
        worker.setIsAvailable(status == ShiftStatus.ON_DUTY);
        worker.setLastActiveAt(Instant.now());
        return WorkerResponse.from(workerRepository.save(worker));
    }

    @Transactional
    public WorkerResponse updateLocation(Long workerId, double lat, double lng) {
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));
        worker.setCurrentLatitude(lat);
        worker.setCurrentLongitude(lng);
        worker.setLastActiveAt(Instant.now());
        return WorkerResponse.from(workerRepository.save(worker));
    }

    public List<WorkerResponse> getAvailableWorkers() {
        return workerRepository.findByIsAvailableTrue().stream()
                .filter(w -> w.getShiftStatus() == ShiftStatus.ON_DUTY)
                .map(WorkerResponse::from)
                .collect(Collectors.toList());
    }
}
