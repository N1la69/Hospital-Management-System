package com.nilanjan.backend.auth.domain;

import java.time.Instant;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    
    @Id
    private ObjectId id;

    private String username;
    private String email;
    private String passwordHash;

    private Set<Role> roles;
    private UserStatus status;

    private Instant createdAt;
    private Instant lastLoginAt;
}
