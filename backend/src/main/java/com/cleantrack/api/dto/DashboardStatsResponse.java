package com.cleantrack.api.dto;

import java.util.List;
import java.util.Map;

public record DashboardStatsResponse(
        long todayComplaints,
        long pendingAssignment,
        long inProgress,
        long resolvedToday,
        long totalWorkers,
        long activeWorkers,
        long slaBreaches,
        List<Map<String, Object>> weeklyTrend,
        List<Map<String, Object>> categoryBreakdown,
        List<Map<String, Object>> zonePerformance
) {}
