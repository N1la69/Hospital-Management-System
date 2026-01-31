package com.nilanjan.backend.doctor.api.dto;

import com.nilanjan.backend.doctor.domain.Specialization;

public record CreateDoctorRequest(
        String firstName,
        String lastName,
        Specialization specialization,
        String qualification,
        int experienceYears,
        int consultationFees,
        String phone,
        String email,
        String address,
        String username,
        String password) {

}
