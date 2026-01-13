package com.nilanjan.backend.doctor.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.doctor.api.dto.CreateDoctorRequest;
import com.nilanjan.backend.doctor.api.dto.DoctorResponse;
import com.nilanjan.backend.doctor.api.dto.DoctorSearchFilter;

public interface DoctorService {

    DoctorResponse createDoctor(CreateDoctorRequest request);

    DoctorResponse getDoctorById(String doctorId);

    List<DoctorResponse> getDoctorBySpecialization(String specialization);

    PageResponse<DoctorResponse> advancedSearch(DoctorSearchFilter filter, int page, int size);

    DoctorResponse getMyDoctorProfile();
}
