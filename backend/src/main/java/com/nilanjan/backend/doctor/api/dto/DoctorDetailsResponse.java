package com.nilanjan.backend.doctor.api.dto;

import java.util.List;

import com.nilanjan.backend.doctor.availability.api.dto.DoctorAvailabilityResponse;

public record DoctorDetailsResponse(
        DoctorResponse doctor,
        List<DoctorAvailabilityResponse> availability) {

}
