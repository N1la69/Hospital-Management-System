package com.nilanjan.backend.doctor.api.dto;

import com.nilanjan.backend.doctor.domain.DoctorStatus;
import com.nilanjan.backend.doctor.domain.Specialization;

public record DoctorResponse(
                String id,
                String doctorCode,
                String firstName,
                String lastName,
                String fullName,
                Specialization specialization,
                String qualification,
                int experienceYears,
                String phone,
                String email,
                String address,
                DoctorStatus status) {

}
