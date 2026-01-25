package com.nilanjan.backend.patient.medical.api.dto;

import java.util.List;

public record UpdateMedicalRecordRequest(
        String recordId,
        DiagnosisDto diagnosis,
        VitalsDto vitals,
        List<MedicationDto> medications,
        String notes) {

}
