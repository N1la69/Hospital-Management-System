package com.nilanjan.backend.patient.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    @Override
    public PatientResponse createPatient(CreatePatientRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'createPatient'");
    }

    @Override
    public PatientResponse getPatientById(String patientId) {
        throw new UnsupportedOperationException("Unimplemented method 'getPatientById'");
    }

    @Override
    public List<PatientResponse> searchPatients(String name, String phone) {
        throw new UnsupportedOperationException("Unimplemented method 'searchPatients'");
    }
    
}
