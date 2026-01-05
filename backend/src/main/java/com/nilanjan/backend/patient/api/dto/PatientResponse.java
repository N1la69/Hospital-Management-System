package com.nilanjan.backend.patient.api.dto;

import com.nilanjan.backend.patient.domain.BloodGroup;
import com.nilanjan.backend.patient.domain.PatientStatus;

public record PatientResponse(
    String id,
    String patientCode,
    String fullName,
    BloodGroup bloodGroup,
    PatientStatus status
) {
    
}
