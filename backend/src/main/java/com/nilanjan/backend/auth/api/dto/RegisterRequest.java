package com.nilanjan.backend.auth.api.dto;

import java.util.Set;

import com.nilanjan.backend.auth.domain.Role;

public record RegisterRequest(String username, String email, String password, Set<Role> roles) {
    
}
