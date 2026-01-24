package com.nilanjan.backend.patient.medical.application;

import java.util.List;

import com.nilanjan.backend.patient.medical.api.dto.CreateMedicalRecordRequest;
import com.nilanjan.backend.patient.medical.api.dto.MedicalRecordResponse;

public interface MedicalRecordService {

    MedicalRecordResponse create(CreateMedicalRecordRequest request);

    List<MedicalRecordResponse> getByPatientId(String patientId);

}
