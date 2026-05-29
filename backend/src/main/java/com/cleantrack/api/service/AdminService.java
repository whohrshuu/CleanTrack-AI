package com.cleantrack.api.service;

import com.cleantrack.api.dto.DashboardStatsResponse;
import com.cleantrack.api.enums.ComplaintStatus;
import com.cleantrack.api.enums.ShiftStatus;
import com.cleantrack.api.repository.ComplaintRepository;
import com.cleantrack.api.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ComplaintRepository complaintRepository;
    private final WorkerRepository workerRepository;

    public DashboardStatsResponse getDashboardStats() {
        Instant startOfDay = Instant.now().truncatedTo(ChronoUnit.DAYS);
        
        long todayComplaints = complaintRepository.countBySubmittedAtAfter(startOfDay);
        long pendingAssignment = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolvedToday = complaintRepository.countResolvedSince(startOfDay);
        long totalWorkers = workerRepository.count();
        long activeWorkers = workerRepository.findByShiftStatus(ShiftStatus.ON_DUTY).size();
        long slaBreaches = complaintRepository.countBySlaDeadlineBeforeAndStatusNotIn(
                Instant.now(), List.of(ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED, ComplaintStatus.REJECTED));

        List<Map<String, Object>> weeklyTrend = getWeeklyTrend().stream().map(row -> Map.of(
                "day", row[0].toString(),
                "complaints", row[1],
                "resolved", 0 // Mocked resolved for now, or we can fetch countDailyResolvedSince
        )).toList();

        List<Map<String, Object>> categoryBreakdown = getCategoryBreakdown().stream().map(row -> {
            long count = ((Number) row[1]).longValue();
            long total = todayComplaints == 0 ? 1 : todayComplaints; // simplified total for %
            return Map.<String, Object>of(
                    "category", row[0].toString(),
                    "count", count,
                    "percentage", (int) ((count * 100) / total)
            );
        }).toList();

        // zonePerformance processing:
        // row: [zone, status, count]
        // We need: zone -> { resolved, pending, slaCompliance }
        java.util.Map<String, java.util.Map<String, Object>> zonesMap = new java.util.HashMap<>();
        for (Object[] row : getZonePerformance()) {
            String zone = row[0] != null ? row[0].toString() : "Unknown";
            String status = row[1].toString();
            long count = ((Number) row[2]).longValue();

            zonesMap.putIfAbsent(zone, new java.util.HashMap<>(Map.of("zone", zone, "resolved", 0L, "pending", 0L, "slaCompliance", 90)));
            java.util.Map<String, Object> zData = zonesMap.get(zone);
            if (status.equals("COMPLETED") || status.equals("VERIFIED") || status.equals("CLOSED")) {
                zData.put("resolved", ((Long) zData.get("resolved")) + count);
            } else if (!status.equals("REJECTED")) {
                zData.put("pending", ((Long) zData.get("pending")) + count);
            }
        }
        List<Map<String, Object>> zonePerformance = new java.util.ArrayList<>(zonesMap.values());

        return new DashboardStatsResponse(
                todayComplaints, pendingAssignment, inProgress, resolvedToday,
                totalWorkers, activeWorkers, slaBreaches,
                weeklyTrend, categoryBreakdown, zonePerformance
        );
    }

    public List<Object[]> getZonePerformance() {
        return complaintRepository.countByZoneAndStatus();
    }

    public List<Object[]> getCategoryBreakdown() {
        return complaintRepository.countByCategory();
    }

    public List<Object[]> getWeeklyTrend() {
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        return complaintRepository.countDailyComplaintsSince(oneWeekAgo);
    }
}
