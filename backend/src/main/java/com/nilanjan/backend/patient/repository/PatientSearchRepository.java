package com.nilanjan.backend.patient.repository;

import java.util.List;

import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.domain.Patient;

public interface PatientSearchRepository {
    List<Patient> search(PatientSearchFilter filter);
}
