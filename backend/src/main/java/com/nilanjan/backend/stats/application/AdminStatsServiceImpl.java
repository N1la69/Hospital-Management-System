package com.nilanjan.backend.stats.application;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.stats.api.dto.AdminStatsResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminStatsServiceImpl implements AdminStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    public AdminStatsResponse getStats() {
        long doctors = mongoTemplate.getCollection("doctors").countDocuments();
        long receptionists = mongoTemplate.getCollection("receptionists").countDocuments();

        return new AdminStatsResponse(doctors, receptionists);
    }

}
