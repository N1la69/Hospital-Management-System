package com.nilanjan.backend.auth.application;

import java.time.Instant;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.domain.Role;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.auth.domain.UserStatus;
import com.nilanjan.backend.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(
            String username,
            String email,
            String rawPassword,
            Set<Role> roles) {

        if (userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Email already exists");

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .roles(roles)
                .status(UserStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        return userRepository.save(user);
    }
}
