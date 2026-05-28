package com.cleantrack.api.repository;

import com.cleantrack.api.entity.Complaint;
import com.cleantrack.api.enums.ComplaintStatus;
import com.cleantrack.api.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenIdOrderBySubmittedAtDesc(Long citizenId);
    List<Complaint> findByAssignedWorkerIdOrderBySubmittedAtDesc(Long workerId);
    List<Complaint> findByStatusIn(List<ComplaintStatus> statuses);
    List<Complaint> findByZone(String zone);
    long countByStatus(ComplaintStatus status);
    long countBySubmittedAtAfter(Instant since);
    List<Complaint> findByStatusAndAssignedWorkerIsNull(ComplaintStatus status);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status IN ('COMPLETED','VERIFIED','CLOSED') AND c.resolvedAt >= :since")
    long countResolvedSince(@Param("since") Instant since);

    @Query("SELECT c FROM Complaint c WHERE (:status IS NULL OR c.status = :status) AND (:priority IS NULL OR c.priority = :priority) AND (:zone IS NULL OR c.zone = :zone) ORDER BY c.submittedAt DESC")
    List<Complaint> findByFilters(@Param("status") ComplaintStatus status, @Param("priority") Priority priority, @Param("zone") String zone);

    @Query("SELECT c.zone, c.status, COUNT(c) FROM Complaint c GROUP BY c.zone, c.status")
    List<Object[]> countByZoneAndStatus();

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category ORDER BY COUNT(c) DESC")
    List<Object[]> countByCategory();

    @Query("SELECT CAST(c.submittedAt AS DATE), COUNT(c) FROM Complaint c WHERE c.submittedAt >= :since GROUP BY CAST(c.submittedAt AS DATE) ORDER BY CAST(c.submittedAt AS DATE)")
    List<Object[]> countDailyComplaintsSince(@Param("since") Instant since);

    @Query("SELECT CAST(c.resolvedAt AS DATE), COUNT(c) FROM Complaint c WHERE c.resolvedAt >= :since AND c.resolvedAt IS NOT NULL GROUP BY CAST(c.resolvedAt AS DATE) ORDER BY CAST(c.resolvedAt AS DATE)")
    List<Object[]> countDailyResolvedSince(@Param("since") Instant since);

    long countBySlaDeadlineBeforeAndStatusNotIn(Instant deadline, List<ComplaintStatus> statuses);
}
