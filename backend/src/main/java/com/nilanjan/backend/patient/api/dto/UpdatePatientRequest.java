package com.nilanjan.backend.patient.api.dto;

import java.time.LocalDate;

import com.nilanjan.backend.patient.domain.BloodGroup;
import com.nilanjan.backend.patient.domain.Gender;

public record UpdatePatientRequest(
        String firstName,
        String lastName,
        Gender gender,
        LocalDate dateOfBirth,
        BloodGroup bloodGroup,
        String phone,
        String email,
        String address) {

}
