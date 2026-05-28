package com.cleantrack.api.service;

import com.cleantrack.api.dto.ComplaintRequest;
import com.cleantrack.api.dto.ComplaintResponse;
import com.cleantrack.api.dto.ComplaintSummaryResponse;
import com.cleantrack.api.entity.Complaint;
import com.cleantrack.api.entity.ComplaintTimeline;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.entity.Worker;
import com.cleantrack.api.enums.ComplaintCategory;
import com.cleantrack.api.enums.ComplaintStatus;
import com.cleantrack.api.enums.Priority;
import com.cleantrack.api.repository.ComplaintRepository;
import com.cleantrack.api.repository.UserRepository;
import com.cleantrack.api.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;

    @Transactional
    public ComplaintResponse createComplaint(Long citizenId, ComplaintRequest req) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Citizen not found"));

        Complaint complaint = Complaint.builder()
                .citizen(citizen)
                .title(req.title())
                .description(req.description())
                .category(ComplaintCategory.valueOf(req.category()))
                .priority(Priority.valueOf(req.priority()))
                .latitude(req.latitude())
                .longitude(req.longitude())
                .address(req.address())
                .wardNumber(req.wardNumber())
                .zone(req.zone())
                .status(ComplaintStatus.SUBMITTED)
                .slaDeadline(Instant.now().plus(48, ChronoUnit.HOURS))
                .build();

        ComplaintTimeline timeline = ComplaintTimeline.builder()
                .complaint(complaint)
                .actor(citizen)
                .eventType("SUBMITTED")
                .description("Complaint submitted")
                .build();

        complaint.setTimeline(List.of(timeline));
        complaint = complaintRepository.save(complaint);
        return ComplaintResponse.from(complaint);
    }

    public ComplaintResponse getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .map(ComplaintResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
    }

    public List<ComplaintSummaryResponse> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenIdOrderBySubmittedAtDesc(citizenId).stream()
                .map(c -> new ComplaintSummaryResponse(c.getId(), c.getTitle(), c.getStatus().name(), c.getPriority().name(), c.getCategory().name(), c.getAddress(), c.getCitizen().getFullName(), c.getSubmittedAt()))
                .collect(Collectors.toList());
    }

    public List<ComplaintSummaryResponse> getComplaintsByWorker(Long workerId) {
        return complaintRepository.findByAssignedWorkerIdOrderBySubmittedAtDesc(workerId).stream()
                .map(c -> new ComplaintSummaryResponse(c.getId(), c.getTitle(), c.getStatus().name(), c.getPriority().name(), c.getCategory().name(), c.getAddress(), c.getCitizen() != null ? c.getCitizen().getFullName() : null, c.getSubmittedAt()))
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllComplaints(ComplaintStatus status, Priority priority, String zone) {
        return complaintRepository.findByFilters(status, priority, zone).stream()
                .map(ComplaintResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse assignComplaint(Long complaintId, Long workerId, Long adminId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Worker not found"));
        User admin = userRepository.findById(adminId).orElse(null);

        complaint.setAssignedWorker(worker);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        complaint.setAssignedAt(Instant.now());

        ComplaintTimeline timeline = ComplaintTimeline.builder()
                .complaint(complaint)
                .actor(admin)
                .eventType("ASSIGNED")
                .description("Assigned to worker " + worker.getUser().getFullName())
                .build();

        complaint.getTimeline().add(timeline);
        return ComplaintResponse.from(complaintRepository.save(complaint));
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, ComplaintStatus newStatus, Long actorId, String description) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;

        complaint.setStatus(newStatus);
        if (newStatus == ComplaintStatus.COMPLETED || newStatus == ComplaintStatus.VERIFIED) {
            if (complaint.getResolvedAt() == null) {
                complaint.setResolvedAt(Instant.now());
            }
        }

        ComplaintTimeline timeline = ComplaintTimeline.builder()
                .complaint(complaint)
                .actor(actor)
                .eventType(newStatus.name())
                .description(description != null ? description : "Status updated to " + newStatus)
                .build();

        complaint.getTimeline().add(timeline);
        return ComplaintResponse.from(complaintRepository.save(complaint));
    }

    public List<ComplaintResponse> getUnassignedComplaints() {
        return complaintRepository.findByStatusAndAssignedWorkerIsNull(ComplaintStatus.SUBMITTED).stream()
                .map(ComplaintResponse::from)
                .collect(Collectors.toList());
    }
}
