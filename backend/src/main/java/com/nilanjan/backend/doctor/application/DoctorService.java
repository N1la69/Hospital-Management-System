package com.nilanjan.backend.doctor.application;

import java.util.List;

import com.nilanjan.backend.doctor.api.dto.CreateDoctorRequest;
import com.nilanjan.backend.doctor.api.dto.DoctorResponse;

public interface DoctorService {

    DoctorResponse createDoctor(CreateDoctorRequest request);

    DoctorResponse getDoctorById(String doctorId);

    List<DoctorResponse> getDoctorBySpecialization(String specialization);
}
