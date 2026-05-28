package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.dto.ComplaintSummaryResponse;
import com.cleantrack.api.dto.WorkerResponse;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.enums.ShiftStatus;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.service.ComplaintService;
import com.cleantrack.api.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;
    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping("/me")
    public ApiResponse<WorkerResponse> getMyProfile() {
        return ApiResponse.ok(workerService.getWorkerByUserId(getCurrentUser().getId()));
    }

    @GetMapping("/tasks")
    public ApiResponse<List<ComplaintSummaryResponse>> getMyTasks() {
        WorkerResponse worker = workerService.getWorkerByUserId(getCurrentUser().getId());
        return ApiResponse.ok(complaintService.getComplaintsByWorker(worker.id()));
    }

    @PutMapping("/shift")
    public ApiResponse<WorkerResponse> updateShiftStatus(@RequestBody Map<String, String> body) {
        WorkerResponse worker = workerService.getWorkerByUserId(getCurrentUser().getId());
        ShiftStatus status = ShiftStatus.valueOf(body.get("status"));
        return ApiResponse.ok(workerService.updateShiftStatus(worker.id(), status));
    }

    @PutMapping("/location")
    public ApiResponse<WorkerResponse> updateLocation(@RequestBody Map<String, Double> body) {
        WorkerResponse worker = workerService.getWorkerByUserId(getCurrentUser().getId());
        return ApiResponse.ok(workerService.updateLocation(worker.id(), body.get("latitude"), body.get("longitude")));
    }
}
