package com.cleantrack.api.dto;

import com.cleantrack.api.entity.User;
import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        String phone,
        String role,
        String avatarUrl,
        int ecoPoints,
        boolean isActive,
        Instant createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole().name(),
                user.getAvatarUrl(),
                user.getEcoPoints(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
