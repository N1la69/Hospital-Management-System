package com.nilanjan.backend.patient.event;

public record PatientCreatedEvent(
    String patientId,
    String patientCode
) {
    
}
