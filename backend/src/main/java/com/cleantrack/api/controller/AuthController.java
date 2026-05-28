package com.cleantrack.api.controller;

import com.cleantrack.api.dto.ApiResponse;
import com.cleantrack.api.dto.AuthRequest;
import com.cleantrack.api.dto.AuthResponse;
import com.cleantrack.api.dto.RegisterRequest;
import com.cleantrack.api.dto.UserResponse;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("Registered successfully", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ApiResponse.ok("Logged in successfully", authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return ApiResponse.ok(UserResponse.from(user));
    }
}
