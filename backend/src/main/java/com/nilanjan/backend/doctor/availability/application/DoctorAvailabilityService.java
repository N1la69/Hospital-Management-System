package com.nilanjan.backend.doctor.availability.application;

import java.util.List;

import com.nilanjan.backend.doctor.availability.api.dto.CreateAvailabilityRequest;
import com.nilanjan.backend.doctor.availability.api.dto.DoctorAvailabilityResponse;

public interface DoctorAvailabilityService {
    DoctorAvailabilityResponse addAvailability(CreateAvailabilityRequest request);

    List<DoctorAvailabilityResponse> getAvailability(String doctorId);
}
