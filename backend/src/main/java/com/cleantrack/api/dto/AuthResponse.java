package com.cleantrack.api.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserResponse user
) {}
