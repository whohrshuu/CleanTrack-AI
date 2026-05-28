package com.cleantrack.api.repository;

import com.cleantrack.api.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByUserIdOrderByEarnedAtDesc(Long userId);
}
