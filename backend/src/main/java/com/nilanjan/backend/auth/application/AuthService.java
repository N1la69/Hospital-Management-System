package com.nilanjan.backend.auth.application;

import com.nilanjan.backend.auth.api.dto.AuthResponse;
import com.nilanjan.backend.auth.api.dto.LoginRequest;
import com.nilanjan.backend.auth.api.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    
    void register(RegisterRequest request);

    AuthResponse refreshToken(String refreshToken);
}
