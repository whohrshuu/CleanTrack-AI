package com.cleantrack.api.dto;

import com.cleantrack.api.entity.Complaint;
import com.cleantrack.api.entity.ComplaintImage;
import com.cleantrack.api.entity.ComplaintTimeline;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public record ComplaintResponse(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        String category,
        Double latitude,
        Double longitude,
        String address,
        String wardNumber,
        String zone,
        Double aiFakeScore,
        Boolean aiVerified,
        Instant submittedAt,
        Instant assignedAt,
        Instant resolvedAt,
        Instant slaDeadline,
        String citizenName,
        Long citizenId,
        String workerName,
        Long workerId,
        String centerName,
        List<ImageDto> images,
        List<TimelineDto> timeline
) {
    public static ComplaintResponse from(Complaint c) {
        return new ComplaintResponse(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.getStatus().name(),
                c.getPriority().name(),
                c.getCategory().name(),
                c.getLatitude(),
                c.getLongitude(),
                c.getAddress(),
                c.getWardNumber(),
                c.getZone(),
                c.getAiFakeScore(),
                c.getAiVerified(),
                c.getSubmittedAt(),
                c.getAssignedAt(),
                c.getResolvedAt(),
                c.getSlaDeadline(),
                c.getCitizen() != null ? c.getCitizen().getFullName() : null,
                c.getCitizen() != null ? c.getCitizen().getId() : null,
                c.getAssignedWorker() != null ? c.getAssignedWorker().getUser().getFullName() : null,
                c.getAssignedWorker() != null ? c.getAssignedWorker().getId() : null,
                c.getCleaningCenter() != null ? c.getCleaningCenter().getName() : null,
                c.getImages() != null ? c.getImages().stream().map(ImageDto::from).collect(Collectors.toList()) : List.of(),
                c.getTimeline() != null ? c.getTimeline().stream().map(TimelineDto::from).collect(Collectors.toList()) : List.of()
        );
    }

    public record ImageDto(Long id, String url, String type, Instant uploadedAt) {
        public static ImageDto from(ComplaintImage img) {
            return new ImageDto(img.getId(), img.getImageUrl(), img.getImageType().name(), img.getUploadedAt());
        }
    }

    public record TimelineDto(Long id, String eventType, String description, Instant createdAt, String actorName) {
        public static TimelineDto from(ComplaintTimeline t) {
            return new TimelineDto(t.getId(), t.getEventType(), t.getDescription(), t.getCreatedAt(), t.getActor() != null ? t.getActor().getFullName() : null);
        }
    }
}
