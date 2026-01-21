package com.nilanjan.backend.auth.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.auth.domain.RefreshToken;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, ObjectId> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUserId(ObjectId userId);
}
