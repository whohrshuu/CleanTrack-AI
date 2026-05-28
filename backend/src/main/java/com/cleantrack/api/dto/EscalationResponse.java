package com.cleantrack.api.dto;

import com.cleantrack.api.entity.Escalation;
import java.time.Instant;

public record EscalationResponse(
        Long id,
        Long complaintId,
        String escalatedByName,
        String escalatedToName,
        String escalationLevel,
        String reason,
        String status,
        Instant escalatedAt,
        Instant resolvedAt
) {
    public static EscalationResponse from(Escalation e) {
        return new EscalationResponse(
                e.getId(),
                e.getComplaint().getId(),
                e.getEscalatedBy().getFullName(),
                e.getEscalatedToName(),
                e.getEscalationLevel().name(),
                e.getReason(),
                e.getStatus().name(),
                e.getEscalatedAt(),
                e.getResolvedAt()
        );
    }
}
