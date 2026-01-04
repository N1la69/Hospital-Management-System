package com.nilanjan.backend.auth.api.dto;

import java.util.Set;

public record RegisterRequest(String username, String email, String password, Set<String> roles) {
    
}
