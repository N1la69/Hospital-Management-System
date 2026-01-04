package com.nilanjan.backend.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.auth.domain.User;
import java.util.Optional;


public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
