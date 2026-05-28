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

@RestController
@RequestMapping("/api/gov")
@RequiredArgsConstructor
public class GovController {

    private final EscalationService escalationService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
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
