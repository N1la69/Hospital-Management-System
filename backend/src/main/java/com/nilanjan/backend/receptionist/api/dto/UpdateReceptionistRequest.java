package com.nilanjan.backend.receptionist.api.dto;

public record UpdateReceptionistRequest(
        String firstName,
        String lastName,
        String phone,
        String email,
        String address) {

}
