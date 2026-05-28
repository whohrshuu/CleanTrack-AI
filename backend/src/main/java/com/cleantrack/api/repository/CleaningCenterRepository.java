package com.cleantrack.api.repository;

import com.cleantrack.api.entity.CleaningCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CleaningCenterRepository extends JpaRepository<CleaningCenter, Long> {
    List<CleaningCenter> findByZone(String zone);
    List<CleaningCenter> findByIsActiveTrue();
}
