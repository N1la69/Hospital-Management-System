package com.nilanjan.backend.patient.api.dto;

import java.time.LocalDate;

import com.nilanjan.backend.patient.domain.BloodGroup;
import com.nilanjan.backend.patient.domain.Gender;
import com.nilanjan.backend.patient.domain.PatientStatus;

public record PatientResponse(
                String id,
                String patientCode,
                String firstName,
                String lastName,
                String fullName,
                Gender gender,
                LocalDate dateOfBirth,
                BloodGroup bloodGroup,
                String phone,
                String email,
                String address,
                PatientStatus status) {

}
