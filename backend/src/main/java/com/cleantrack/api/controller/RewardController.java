package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.dto.UserResponse;
import com.cleantrack.api.entity.Reward;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @GetMapping("/my")
    public ApiResponse<List<Reward>> getMyRewards() {
        return ApiResponse.ok(rewardService.getUserRewards(getCurrentUser().getId()));
    }

    @GetMapping("/leaderboard")
    public ApiResponse<List<UserResponse>> getLeaderboard() {
        return ApiResponse.ok(rewardService.getLeaderboard().stream()
                .map(UserResponse::from).collect(Collectors.toList()));
    }
}
