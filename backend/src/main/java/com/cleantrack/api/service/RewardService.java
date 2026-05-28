package com.cleantrack.api.service;

import com.cleantrack.api.entity.Reward;
import com.cleantrack.api.entity.User;
import com.cleantrack.api.repository.RewardRepository;
import com.cleantrack.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;

    public List<Reward> getUserRewards(Long userId) {
        return rewardRepository.findByUserIdOrderByEarnedAtDesc(userId);
    }

    @Transactional
    public void awardPoints(Long userId, int points, String description, String rewardType, String badgeName, String badgeIcon) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setEcoPoints(user.getEcoPoints() + points);
        userRepository.save(user);

        Reward reward = Reward.builder()
                .user(user)
                .points(points)
                .description(description)
                .rewardType(rewardType)
                .badgeName(badgeName)
                .badgeIcon(badgeIcon)
                .earnedAt(Instant.now())
                .build();

        rewardRepository.save(reward);
    }

    public List<User> getLeaderboard() {
        return userRepository.findTop10ByOrderByEcoPointsDesc();
    }
}
