package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.dto.ComplaintRequest;
import com.cleantrack.api.dto.ComplaintResponse;
import com.cleantrack.api.dto.ComplaintSummaryResponse;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.enums.ComplaintStatus;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @PostMapping
    public ApiResponse<ComplaintResponse> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        return ApiResponse.ok("Complaint submitted", complaintService.createComplaint(getCurrentUser().getId(), request));
    }

    @GetMapping("/{id}")
    public ApiResponse<ComplaintResponse> getComplaint(@PathVariable Long id) {
        return ApiResponse.ok(complaintService.getComplaintById(id));
    }

    @GetMapping("/my")
    public ApiResponse<List<ComplaintSummaryResponse>> getMyComplaints() {
        return ApiResponse.ok(complaintService.getComplaintsByCitizen(getCurrentUser().getId()));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<ComplaintResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ComplaintStatus status = ComplaintStatus.valueOf(body.get("status"));
        String description = body.get("description");
        return ApiResponse.ok("Status updated", complaintService.updateStatus(id, status, getCurrentUser().getId(), description));
    }
}
