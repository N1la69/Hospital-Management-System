package com.nilanjan.backend.patient.repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.domain.Patient;

public interface PatientSearchRepository {
    PageResult<Patient> search(PatientSearchFilter filter, int page, int size);
}
