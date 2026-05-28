package com.cleantrack.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComplaintRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String category,
        @NotBlank String priority,
        @NotNull Double latitude,
        @NotNull Double longitude,
        @NotBlank String address,
        String wardNumber,
        String zone
) {}
