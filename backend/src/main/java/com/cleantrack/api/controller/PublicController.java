package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.entity.CleaningCenter;
import com.cleantrack.api.repository.CleaningCenterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final CleaningCenterRepository cleaningCenterRepository;

    @GetMapping("/centers")
    public ApiResponse<List<CleaningCenter>> getCenters() {
        return ApiResponse.ok(cleaningCenterRepository.findByIsActiveTrue());
    }

    @GetMapping("/stats")
    public ApiResponse<String> getStats() {
        return ApiResponse.ok("Public API is running", null);
    }
}
