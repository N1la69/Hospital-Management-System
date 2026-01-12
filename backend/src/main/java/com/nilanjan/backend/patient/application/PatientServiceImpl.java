package com.nilanjan.backend.patient.application;

import java.time.Instant;
import java.util.HashSet;
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
import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.domain.Patient;
import com.nilanjan.backend.patient.domain.PatientStatus;
import com.nilanjan.backend.patient.event.PatientCreatedEvent;
import com.nilanjan.backend.patient.repository.PatientRepository;
import com.nilanjan.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final UserAccountService userAccountService;

    @Override
    public PatientResponse createPatient(CreatePatientRequest request) {

        ObjectId linkedUserId = null;

        if (request.createLogin()) {
            User user = userAccountService.createUser(request.username(), request.email(), request.password(),
                    Set.of(Role.PATIENT));
            linkedUserId = user.getId();
        }

        Patient patient = Patient.builder()
                .patientCode(PatientCodeGenerator.generate())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .gender(request.gender())
                .dateOfBirth(request.dateOfBirth())
                .bloodGroup(request.bloodGroup())
                .contact(ContactInfo.builder()
                        .phone(request.phone())
                        .email(request.email())
                        .address(request.address())
                        .build())
                .linkedUserId(linkedUserId)
                .status(PatientStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        Patient saved = patientRepository.save(patient);

        eventPublisher.publishEvent(
                new PatientCreatedEvent(saved.getId().toHexString(), saved.getPatientCode()));

        return mapToResponse(saved);
    }

    @Override
    public PatientResponse getPatientById(String patientId) {

        Patient patient = patientRepository.findById(new ObjectId(patientId))
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

        if (SecurityUtil.hasRole("ADMIN"))
            return mapToResponse(patient);

        ObjectId currentUserId = SecurityUtil.currentUserId();

        if (SecurityUtil.hasRole("PATIENT") && currentUserId.equals(patient.getLinkedUserId()))
            return mapToResponse(patient);

        if (SecurityUtil.hasRole("DOCTOR") && patient.getAssignedDoctorIds() != null
                && patient.getAssignedDoctorIds().contains(currentUserId))
            return mapToResponse(patient);

        throw new RuntimeException("Access Denied");
    }

    @Override
    public List<PatientResponse> searchPatients(String name, String phone) {

        List<Patient> patients;

        if (phone != null && !phone.isBlank()) {
            patients = patientRepository.findByContact_Phone(phone);
        } else if (name != null && !name.isBlank()) {
            patients = patientRepository.findByFirstNameContainingIgnoreCase(name);
        } else {
            patients = patientRepository.findAll();
        }

        return patients.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void assignDoctor(String patientId, String doctorId) {
        Patient patient = patientRepository.findById(new ObjectId(patientId))
                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

        ObjectId doctorObjectId = new ObjectId(doctorId);

        if (patient.getAssignedDoctorIds() == null)
            patient.setAssignedDoctorIds(new HashSet<>());

        patient.getAssignedDoctorIds().add(doctorObjectId);

        patientRepository.save(patient);
    }

    @Override
    public List<PatientResponse> advancedSearch(PatientSearchFilter filter) {
        return patientRepository.search(filter)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PatientResponse mapToResponse(Patient patient) {
        return new PatientResponse(
                patient.getId().toHexString(),
                patient.getPatientCode(),
                patient.getFirstName() + " " + patient.getLastName(),
                patient.getBloodGroup(),
                patient.getStatus());
    }

}
