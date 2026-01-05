package com.nilanjan.backend.doctor.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nilanjan.backend.doctor.api.dto.CreateDoctorRequest;
import com.nilanjan.backend.doctor.api.dto.DoctorResponse;
import com.nilanjan.backend.doctor.repository.DoctorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    // private final DoctorRepository doctorRepository;

    @Override
    public DoctorResponse createDoctor(CreateDoctorRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'createDoctor'");
    }

    @Override
    public DoctorResponse getDoctorById(String doctorId) {
        throw new UnsupportedOperationException("Unimplemented method 'getDoctorById'");
    }

    @Override
    public List<DoctorResponse> getDoctorBySpecialization(String specialization) {
        throw new UnsupportedOperationException("Unimplemented method 'getDoctorBySpecialization'");
    }

}
