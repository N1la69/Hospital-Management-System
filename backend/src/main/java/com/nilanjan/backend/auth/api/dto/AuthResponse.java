package com.nilanjan.backend.auth.api.dto;

public record AuthResponse(String accessToken, String refreshToken, long expiresIn) {
    
}
