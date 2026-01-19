package com.nilanjan.backend.doctor.api.dto;

import com.nilanjan.backend.doctor.domain.Specialization;

public record UpdateDoctorRequest(
        String firstName,
        String lastName,
        Specialization specialization,
        String qualification,
        int experienceYears,
        String phone,
        String email,
        String address

) {

}
