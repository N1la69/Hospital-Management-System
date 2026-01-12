package com.nilanjan.backend.patient.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;

public interface PatientService {
    PatientResponse createPatient(CreatePatientRequest request);

    PatientResponse getPatientById(String patientId);

    List<PatientResponse> searchPatients(String name, String phone);

    PageResponse<PatientResponse> advancedSearch(PatientSearchFilter filter, int page, int size);

    void assignDoctor(String patientId, String doctorId);
}
