package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.dto.EscalationResponse;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.service.EscalationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import com.cleantrack.api.service.AdminService;
import com.cleantrack.api.dto.DashboardStatsResponse;

@RestController
@RequestMapping("/api/gov")
@RequiredArgsConstructor
public class GovController {

    private final EscalationService escalationService;
    private final AdminService adminService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping("/overview")
    public ApiResponse<Map<String, Object>> getOverview() {
        DashboardStatsResponse adminStats = adminService.getDashboardStats();
        Map<String, Object> govStats = new java.util.HashMap<>();
        govStats.put("totalComplaints", adminStats.todayComplaints() * 30); // mock month multiplier
        govStats.put("resolvedThisMonth", adminStats.resolvedToday() * 30);
        govStats.put("pendingEscalations", escalationService.getOpenEscalations().size());
        govStats.put("avgSlaCompliance", 92);
        govStats.put("monthlyTrend", List.of(
                Map.of("month", "Jan", "complaints", 120, "resolved", 100),
                Map.of("month", "Feb", "complaints", 150, "resolved", 130),
                Map.of("month", "Mar", "complaints", 180, "resolved", 160)
        ));
        govStats.put("zonePerformance", adminStats.zonePerformance());
        govStats.put("citizenSatisfaction", 88);
        govStats.put("departments", 4);
        govStats.put("totalWorkers", adminStats.totalWorkers());
        
        return ApiResponse.ok(govStats);
    }

    @GetMapping("/escalations")
    public ApiResponse<List<EscalationResponse>> getEscalations() {
        return ApiResponse.ok(escalationService.getOpenEscalations());
    }

    @PostMapping("/escalations")
    public ApiResponse<EscalationResponse> createEscalation(@RequestBody Map<String, String> body) {
        Long complaintId = Long.parseLong(body.get("complaintId"));
        return ApiResponse.ok("Escalated", escalationService.createEscalation(
                complaintId, getCurrentUser().getId(), body.get("toName"), body.get("level"), body.get("reason")));
    }

    @PutMapping("/escalations/{id}/resolve")
    public ApiResponse<EscalationResponse> resolveEscalation(@PathVariable Long id) {
        return ApiResponse.ok("Resolved", escalationService.resolveEscalation(id));
    }
}
