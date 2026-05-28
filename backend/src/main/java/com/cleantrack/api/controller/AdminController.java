package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.dto.ComplaintResponse;
import com.cleantrack.api.dto.DashboardStatsResponse;
import com.cleantrack.api.dto.WorkerResponse;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.enums.ComplaintStatus;
import com.cleantrack.api.enums.Priority;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.service.AdminService;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ComplaintService complaintService;
    private final WorkerService workerService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping("/dashboard")
    public ApiResponse<DashboardStatsResponse> getDashboardStats() {
        return ApiResponse.ok(adminService.getDashboardStats());
    }

    @GetMapping("/complaints")
    public ApiResponse<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String zone) {
        return ApiResponse.ok(complaintService.getAllComplaints(status, priority, zone));
    }

    @PutMapping("/complaints/{id}/assign")
    public ApiResponse<ComplaintResponse> assignComplaint(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ApiResponse.ok("Assigned", complaintService.assignComplaint(id, body.get("workerId"), getCurrentUser().getId()));
    }

    @GetMapping("/workers")
    public ApiResponse<List<WorkerResponse>> getWorkers() {
        return ApiResponse.ok(workerService.getAllWorkers());
    }

    @GetMapping("/zones")
    public ApiResponse<List<Object[]>> getZonePerformance() {
        return ApiResponse.ok(adminService.getZonePerformance());
    }

    @GetMapping("/categories")
    public ApiResponse<List<Object[]>> getCategories() {
        return ApiResponse.ok(adminService.getCategoryBreakdown());
    }

    @GetMapping("/trends/weekly")
    public ApiResponse<List<Object[]>> getWeeklyTrend() {
        return ApiResponse.ok(adminService.getWeeklyTrend());
    }

    @GetMapping("/unassigned")
    public ApiResponse<List<ComplaintResponse>> getUnassigned() {
        return ApiResponse.ok(complaintService.getUnassignedComplaints());
    }
}
