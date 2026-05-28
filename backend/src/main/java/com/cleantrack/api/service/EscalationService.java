package com.cleantrack.api.service;

import com.cleantrack.api.dto.EscalationResponse;
import com.cleantrack.api.entity.Complaint;
import com.cleantrack.api.entity.Escalation;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.enums.ComplaintStatus;
import com.cleantrack.api.enums.EscalationLevel;
import com.cleantrack.api.enums.EscalationStatus;
import com.cleantrack.api.repository.ComplaintRepository;
import com.cleantrack.api.repository.EscalationRepository;
import com.cleantrack.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EscalationService {

    private final EscalationRepository escalationRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @Transactional
    public EscalationResponse createEscalation(Long complaintId, Long escalatedById, String toName, String level, String reason) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        User escalatedBy = userRepository.findById(escalatedById)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Escalation escalation = Escalation.builder()
                .complaint(complaint)
                .escalatedBy(escalatedBy)
                .escalatedToName(toName)
                .escalationLevel(EscalationLevel.valueOf(level))
                .reason(reason)
                .status(EscalationStatus.OPEN)
                .escalatedAt(Instant.now())
                .build();

        complaint.setStatus(ComplaintStatus.ESCALATED);
        complaintRepository.save(complaint);

        return EscalationResponse.from(escalationRepository.save(escalation));
    }

    public List<EscalationResponse> getOpenEscalations() {
        return escalationRepository.findByStatus(EscalationStatus.OPEN).stream()
                .map(EscalationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public EscalationResponse resolveEscalation(Long id) {
        Escalation escalation = escalationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escalation not found"));
        
        escalation.setStatus(EscalationStatus.RESOLVED);
        escalation.setResolvedAt(Instant.now());
        return EscalationResponse.from(escalationRepository.save(escalation));
    }
}
