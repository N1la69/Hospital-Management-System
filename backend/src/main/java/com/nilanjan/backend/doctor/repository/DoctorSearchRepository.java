package com.nilanjan.backend.doctor.repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.doctor.api.dto.DoctorSearchFilter;
import com.nilanjan.backend.doctor.domain.Doctor;

public interface DoctorSearchRepository {
    PageResult<Doctor> search(DoctorSearchFilter filter, int page, int size);
}
