package com.nilanjan.backend.patient.application;

import java.util.List;

import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSelfRegisterRequest;

public interface PatientService {
    PatientResponse createPatient(CreatePatientRequest request);

    PatientResponse selfRegister(PatientSelfRegisterRequest request);

    PatientResponse getPatientById(String patientId);

    List<PatientResponse> searchPatients(String name, String phone);

    void assignDoctor(String patientId, String doctorId);
}
