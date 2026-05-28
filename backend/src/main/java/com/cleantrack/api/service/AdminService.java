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
                Instant.now(), List.of(ComplaintStatus.COMPLETED, ComplaintStatus.VERIFIED, ComplaintStatus.CLOSED, ComplaintStatus.REJECTED));

        return new DashboardStatsResponse(
                todayComplaints, pendingAssignment, inProgress, resolvedToday,
                totalWorkers, activeWorkers, slaBreaches
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
