package com.nilanjan.backend.auth.application;

import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.api.dto.AuthResponse;
import com.nilanjan.backend.auth.api.dto.LoginRequest;
import com.nilanjan.backend.auth.api.dto.RegisterRequest;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponse login(LoginRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'login'");
    }

    @Override
    public void register(RegisterRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'register'");
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        throw new UnsupportedOperationException("Unimplemented method 'refreshToken'");
    }
    
}
