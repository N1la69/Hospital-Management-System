package com.nilanjan.backend.pharmacist.api.dto;

public record CreatePharmacistRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        String username,
        String password) {

}
