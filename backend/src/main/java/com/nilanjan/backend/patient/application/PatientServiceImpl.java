package com.nilanjan.backend.patient.application;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.common.ContactInfo;
import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.domain.Patient;
import com.nilanjan.backend.patient.domain.PatientStatus;
import com.nilanjan.backend.patient.event.PatientCreatedEvent;
import com.nilanjan.backend.patient.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public PatientResponse createPatient(CreatePatientRequest request) {

        Patient patient = Patient.builder()
                .patientCode(PatientCodeGenerator.generate())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .gender(request.gender())
                .dateOfBirth(request.dateOfBirth())
                .bloodGroup(request.bloodGroup())
                .contact(ContactInfo.builder()
                        .phone(request.phone())
                        .email(request.email())
                        .address(request.address())
                        .build())
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

        return mapToResponse(patient);
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

    private PatientResponse mapToResponse(Patient patient) {
        return new PatientResponse(
                patient.getId().toHexString(),
                patient.getPatientCode(),
                patient.getFirstName() + " " + patient.getLastName(),
                patient.getBloodGroup(),
                patient.getStatus());
    }

}
