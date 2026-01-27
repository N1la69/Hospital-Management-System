package com.nilanjan.backend.patient.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.SimpleOption;
import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientDetailsResponse;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.api.dto.UpdatePatientRequest;

public interface PatientService {
    PatientResponse createPatient(CreatePatientRequest request);

    PatientResponse updatePatient(String patientId, UpdatePatientRequest request);

    void deletePatient(String patientId);

    PatientDetailsResponse getPatientDetails(String patientId);

    List<SimpleOption> patientOptions();

    PageResponse<PatientResponse> advancedSearch(PatientSearchFilter filter, int page, int size);

}
