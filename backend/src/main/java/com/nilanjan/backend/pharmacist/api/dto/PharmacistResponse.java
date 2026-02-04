package com.nilanjan.backend.pharmacist.api.dto;

import com.nilanjan.backend.pharmacist.domain.PharmacistStatus;

public record PharmacistResponse(
        String id,
        String pharmacistCode,
        String firstName,
        String lastName,
        String fullName,
        String phone,
        String email,
        String address,
        PharmacistStatus status) {

}
