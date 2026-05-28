package com.cleantrack.api.repository;

import com.cleantrack.api.entity.ComplaintImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintImageRepository extends JpaRepository<ComplaintImage, Long> {
    List<ComplaintImage> findByComplaintId(Long complaintId);
}
