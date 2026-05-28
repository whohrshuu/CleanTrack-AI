package com.cleantrack.api.dto;

import java.time.Instant;

public record ComplaintSummaryResponse(
        Long id,
        String title,
        String status,
        String priority,
        String category,
        String address,
        String citizenName,
        Instant submittedAt
) {}
