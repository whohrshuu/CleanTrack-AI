package com.cleantrack.api.dto;

public record DashboardStatsResponse(
        long todayComplaints,
        long pendingAssignment,
        long inProgress,
        long resolvedToday,
        long totalWorkers,
        long activeWorkers,
        long slaBreaches
) {}
