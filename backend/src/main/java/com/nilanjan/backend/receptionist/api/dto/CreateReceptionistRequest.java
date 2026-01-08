package com.nilanjan.backend.receptionist.api.dto;

public record CreateReceptionistRequest(
        String firstName,
        String lastName,
        String phone,
        String email,
        String address,
        String username,
        String password) {

}
