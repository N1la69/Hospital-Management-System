package com.nilanjan.backend.doctor.api.dto;

import com.nilanjan.backend.doctor.domain.DoctorStatus;
import com.nilanjan.backend.doctor.domain.Specialization;

public record DoctorResponse(
                String id,
                String doctorCode,
                String fullName,
                Specialization specialization,
                String email,
                DoctorStatus status) {

}
