package com.nilanjan.backend.doctor.application;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.application.UserAccountService;
import com.nilanjan.backend.auth.domain.Role;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.common.ContactInfo;
import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.common.dto.SimpleOption;
import com.nilanjan.backend.doctor.api.dto.CreateDoctorRequest;
import com.nilanjan.backend.doctor.api.dto.DoctorResponse;
import com.nilanjan.backend.doctor.api.dto.DoctorSearchFilter;
import com.nilanjan.backend.doctor.domain.Doctor;
import com.nilanjan.backend.doctor.domain.DoctorStatus;
import com.nilanjan.backend.doctor.event.DoctorCreatedEvent;
import com.nilanjan.backend.doctor.repository.DoctorRepository;
import com.nilanjan.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final UserAccountService userAccountService;

    @Override
    public DoctorResponse createDoctor(CreateDoctorRequest request) {

        User doctorUser = userAccountService.createUser(request.username(), request.email(), request.password(),
                Set.of(Role.DOCTOR));

        Doctor doctor = Doctor.builder()
                .doctorCode(DoctorCodeGenerator.generate())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .specialization(request.specialization())
                .qualification(request.qualification())
                .experienceYears(request.experienceYears())
                .contact(ContactInfo.builder()
                        .phone(request.phone())
                        .email(request.email())
                        .address(request.address())
                        .build())
                .linkedUserId(doctorUser.getId())
                .status(DoctorStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        Doctor saved = doctorRepository.save(doctor);

        eventPublisher.publishEvent(
                new DoctorCreatedEvent(saved.getId().toHexString(), saved.getDoctorCode()));

        return mapToResponse(saved);
    }

    @Override
    public DoctorResponse getDoctorById(String doctorId) {
        Doctor doctor = doctorRepository.findById(new ObjectId(doctorId))
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

        return mapToResponse(doctor);
    }

    @Override
    public List<DoctorResponse> getDoctorBySpecialization(String specialization) {
        List<Doctor> doctors;

        if (specialization != null && !specialization.isBlank()) {
            doctors = doctorRepository.findBySpecialization(specialization);
        } else {
            doctors = doctorRepository.findAll();
        }

        return doctors.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<DoctorResponse> advancedSearch(DoctorSearchFilter filter, int page, int size) {

        PageResult<Doctor> result = doctorRepository.search(filter, page, size);
        List<DoctorResponse> items = result.data().stream()
                .map(this::mapToResponse)
                .toList();

        return new PageResponse<>(items, result.total(), page, size);
    }

    @Override
    public DoctorResponse getMyDoctorProfile() {
        ObjectId userId = SecurityUtil.currentUserId();
        Doctor doctor = doctorRepository.findByLinkedUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        return mapToResponse(doctor);
    }

    @Override
    public List<SimpleOption> doctorOptions() {
        return doctorRepository.findAll()
                .stream()
                .map(d -> new SimpleOption(
                        d.getId().toHexString(),
                        d.getFirstName() + " " + d.getLastName()))
                .toList();
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId().toHexString(),
                doctor.getDoctorCode(),
                doctor.getFirstName() + " " + doctor.getLastName(),
                doctor.getSpecialization(),
                doctor.getStatus());
    }
}
