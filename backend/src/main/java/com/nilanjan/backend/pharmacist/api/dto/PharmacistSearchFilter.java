package com.nilanjan.backend.pharmacist.api.dto;

import com.nilanjan.backend.pharmacist.domain.PharmacistStatus;

public record PharmacistSearchFilter(
        String name,
        String pharmacistCode,
        String email,
        PharmacistStatus status) {

}
