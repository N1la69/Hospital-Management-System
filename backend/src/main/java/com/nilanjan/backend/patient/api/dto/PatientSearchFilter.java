package com.nilanjan.backend.patient.api.dto;

import java.time.Instant;

import com.nilanjan.backend.patient.domain.BloodGroup;
import com.nilanjan.backend.patient.domain.Gender;
import com.nilanjan.backend.patient.domain.PatientStatus;

public record PatientSearchFilter(
        String name,
        String patientCode,
        String email,
        BloodGroup bloodGroup,
        PatientStatus status,
        Gender gender,
        Instant dobFrom,
        Instant dobTo) {

}
