package com.nilanjan.backend.patient.medical.api.dto;

import java.time.Instant;
import java.util.List;

public record CreateMedicalRecordRequest(
        String patientId,
        String doctorId,
        String appointmentId,
        boolean manualEntry,
        Instant visitDate,
        DiagnosisDto diagnosis,
        VitalsDto vitals,
        List<MedicationDto> medications,
        String notes) {

}
