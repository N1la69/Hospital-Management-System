package com.nilanjan.backend.auth.application;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.api.dto.AuthResponse;
import com.nilanjan.backend.auth.api.dto.LoginRequest;
import com.nilanjan.backend.auth.api.dto.RegisterRequest;
import com.nilanjan.backend.auth.domain.RefreshToken;
import com.nilanjan.backend.auth.domain.RoleMapper;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.auth.domain.UserStatus;
import com.nilanjan.backend.auth.event.UserRegisteredEvent;
import com.nilanjan.backend.auth.repository.RefreshTokenRepository;
import com.nilanjan.backend.auth.repository.UserRepository;
import com.nilanjan.backend.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid Credentials");
        }

        String accessToken = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken();

        refreshTokenRepository.deleteByUserId(user.getId());

        refreshTokenRepository.save(
                RefreshToken.builder()
                        .userId(user.getId())
                        .token(refreshToken)
                        .expiresAt(Instant.now().plus(30, ChronoUnit.DAYS))
                        .revoked(false)
                        .build());

        return new AuthResponse(accessToken, refreshToken, 900);
    }

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("An username already exists with this email.");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .roles(RoleMapper.fromStrings(request.roles()))
                .status(UserStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        userRepository.save(user);

        applicationEventPublisher.publishEvent(new UserRegisteredEvent(user.getId(), user.getUsername()));
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {

        System.out.println("🔄 Refresh token request received");
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid Refresh Token"));

        if (stored.isRevoked() || stored.getExpiresAt().isBefore(Instant.now()))
            throw new RuntimeException("Refresh Token expired");

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtTokenProvider.generateToken(user);

        System.out.println("✅ New access token generated for user " + user.getId());
        return new AuthResponse(newAccessToken, refreshToken, 900);
    }

}
