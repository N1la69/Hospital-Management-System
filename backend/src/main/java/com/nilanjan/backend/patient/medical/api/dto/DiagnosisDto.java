package com.nilanjan.backend.patient.medical.api.dto;

import java.util.List;

public record DiagnosisDto(
        String primaryDiagnosis,
        List<String> secondaryDiagnosis,
        List<String> symptoms,
        String clinicalNotes) {

}
