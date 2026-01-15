package com.nilanjan.backend.patient.api.dto;

import com.nilanjan.backend.patient.domain.BloodGroup;
import com.nilanjan.backend.patient.domain.Gender;
import com.nilanjan.backend.patient.domain.PatientStatus;

public record PatientResponse(
        String id,
        String patientCode,
        String fullName,
        Gender gender,
        String email,
        BloodGroup bloodGroup,
        PatientStatus status) {

}
