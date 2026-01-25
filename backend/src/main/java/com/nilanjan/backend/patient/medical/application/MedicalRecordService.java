package com.nilanjan.backend.patient.medical.application;

import java.util.List;

import com.nilanjan.backend.patient.medical.api.dto.CreateMedicalRecordRequest;
import com.nilanjan.backend.patient.medical.api.dto.MedicalRecordResponse;
import com.nilanjan.backend.patient.medical.api.dto.UpdateMedicalRecordRequest;

public interface MedicalRecordService {

    MedicalRecordResponse create(CreateMedicalRecordRequest request);

    MedicalRecordResponse update(UpdateMedicalRecordRequest request);

    List<MedicalRecordResponse> getByPatientId(String patientId);

}
