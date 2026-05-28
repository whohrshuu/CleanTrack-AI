package com.cleantrack.api.repository;

import com.cleantrack.api.entity.Escalation;
import com.cleantrack.api.enums.EscalationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EscalationRepository extends JpaRepository<Escalation, Long> {
    List<Escalation> findByStatus(EscalationStatus status);
    Optional<Escalation> findByComplaintId(Long complaintId);
}
