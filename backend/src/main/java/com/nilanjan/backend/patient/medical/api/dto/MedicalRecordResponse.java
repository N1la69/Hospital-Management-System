package com.nilanjan.backend.patient.medical.api.dto;

import java.time.Instant;
import java.util.List;

public record MedicalRecordResponse(
        String id,
        String patientId,
        String doctorId,
        String appointmentId,
        boolean manualEntry,
        Instant visitDate,
        DiagnosisDto diagnosis,
        VitalsDto vitals,
        List<MedicationDto> medications,
        String notes,
        Instant createdAt,
        Instant updatedAt) {

}
