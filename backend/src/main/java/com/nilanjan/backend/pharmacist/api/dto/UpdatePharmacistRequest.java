package com.nilanjan.backend.pharmacist.api.dto;

public record UpdatePharmacistRequest(
        String firstName,
        String lastName,
        String phone,
        String email,
        String address) {

}
