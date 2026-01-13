package com.nilanjan.backend.doctor.api.dto;

import com.nilanjan.backend.doctor.domain.DoctorStatus;
import com.nilanjan.backend.doctor.domain.Specialization;

public record DoctorSearchFilter(
                String name,
                String doctorCode,
                Specialization specialization,
                String qualification,
                Integer experienceYears,
                String email,
                DoctorStatus status) {

}
