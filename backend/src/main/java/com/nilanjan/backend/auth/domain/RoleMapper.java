package com.nilanjan.backend.auth.domain;

import java.util.Set;
import java.util.stream.Collectors;

public class RoleMapper {
    
    public static Set<Role> fromStrings(Set<String> roles){
        return roles.stream()
                    .map(role -> Role.valueOf(role.toUpperCase()))
                    .collect(Collectors.toSet());
    }
}
