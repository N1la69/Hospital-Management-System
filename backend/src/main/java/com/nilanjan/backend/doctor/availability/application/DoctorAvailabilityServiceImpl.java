package com.nilanjan.backend.doctor.availability.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nilanjan.backend.doctor.availability.api.dto.CreateAvailabilityRequest;
import com.nilanjan.backend.doctor.availability.api.dto.DoctorAvailabilityResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Override
    public DoctorAvailabilityResponse addAvailability(CreateAvailabilityRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'addAvailability'");
    }

    @Override
    public List<DoctorAvailabilityResponse> getAvailability(String doctorId) {
        throw new UnsupportedOperationException("Unimplemented method 'getAvailability'");
    }

}
