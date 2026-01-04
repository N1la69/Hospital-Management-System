package com.nilanjan.backend.security;

import org.bson.types.ObjectId;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        ObjectId objectId = new ObjectId(userId); 

        return userRepository.findById(objectId)
                            .map(UserPrincipal::new)
                            .orElseThrow(() -> new UsernameNotFoundException("User not found:" + userId));
    }
}
