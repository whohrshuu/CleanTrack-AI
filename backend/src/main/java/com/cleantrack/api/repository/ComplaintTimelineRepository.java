package com.cleantrack.api.repository;

import com.cleantrack.api.entity.ComplaintTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintTimelineRepository extends JpaRepository<ComplaintTimeline, Long> {
    List<ComplaintTimeline> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
}
