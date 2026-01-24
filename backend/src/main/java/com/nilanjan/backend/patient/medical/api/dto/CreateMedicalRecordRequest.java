package com.nilanjan.backend.patient.medical.api.dto;

import java.time.Instant;
import java.util.List;

public record CreateMedicalRecordRequest(
                String patientId,
                boolean manualEntry,
                Instant visitDate,
                DiagnosisDto diagnosis,
                VitalsDto vitals,
                List<MedicationDto> medications,
                String notes) {

}
