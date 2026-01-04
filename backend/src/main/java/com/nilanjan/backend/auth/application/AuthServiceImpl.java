package com.nilanjan.backend.auth.application;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.api.dto.AuthResponse;
import com.nilanjan.backend.auth.api.dto.LoginRequest;
import com.nilanjan.backend.auth.api.dto.RegisterRequest;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.auth.repository.UserRepository;
import com.nilanjan.backend.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username()).orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if(!passwordEncoder.matches(request.password(), user.getPasswordHash())){
            throw new RuntimeException("Invalid Credentials");
        }

        String accessToken = jwtTokenProvider.generateToken(user);

        return new AuthResponse(accessToken, null, 900);
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
