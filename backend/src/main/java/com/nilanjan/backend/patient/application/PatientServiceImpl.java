package com.nilanjan.backend.patient.application;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.appointment.domain.AppointmentStatus;
import com.nilanjan.backend.appointment.repository.AppointmentRepository;
import com.nilanjan.backend.auth.application.UserAccountService;
import com.nilanjan.backend.auth.domain.Role;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.auth.repository.UserRepository;
import com.nilanjan.backend.common.ContactInfo;
import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.common.dto.SimpleOption;
import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.api.dto.UpdatePatientRequest;
import com.nilanjan.backend.patient.domain.Patient;
import com.nilanjan.backend.patient.domain.PatientStatus;
import com.nilanjan.backend.patient.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

        private final PatientRepository patientRepository;
        private final AppointmentRepository appointmentRepository;
        private final UserAccountService userAccountService;
        private final UserRepository userRepository;

        @Override
        public PatientResponse createPatient(CreatePatientRequest request) {

                ObjectId linkedUserId = null;

                if (request.createLogin()) {
                        User user = userAccountService.createUser(request.username(), request.email(),
                                        request.password(),
                                        Set.of(Role.PATIENT));
                        linkedUserId = user.getId();
                }

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
                                .linkedUserId(linkedUserId)
                                .status(PatientStatus.ACTIVE)
                                .createdAt(Instant.now())
                                .build();

                Patient saved = patientRepository.save(patient);

                return mapToResponse(saved);
        }

        @Override
        public PatientResponse updatePatient(String patientId, UpdatePatientRequest request) {

                Patient patient = patientRepository.findById(new ObjectId(patientId))
                                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

                patient.setFirstName(request.firstName());
                patient.setLastName(request.lastName());
                patient.setGender(request.gender());
                patient.setDateOfBirth(request.dateOfBirth());
                patient.setBloodGroup(request.bloodGroup());

                ContactInfo contact = patient.getContact();
                contact.setPhone(request.phone());
                contact.setEmail(request.email());
                contact.setAddress(request.address());

                Patient saved = patientRepository.save(patient);

                return mapToResponse(saved);
        }

        @Override
        public void deletePatient(String patientId) {

                Patient patient = patientRepository.findById(new ObjectId(patientId))
                                .orElseThrow(() -> new RuntimeException("Patient not found: " + patientId));

                ObjectId linkedUserId = patient.getLinkedUserId();

                appointmentRepository.deleteByPatientIdAndStatus(patient.getId(), AppointmentStatus.SCHEDULED);

                patientRepository.deleteById(patient.getId());

                if (linkedUserId != null)
                        userRepository.deleteById(linkedUserId);
        }

        @Override
        public PageResponse<PatientResponse> advancedSearch(PatientSearchFilter filter, int page, int size) {

                PageResult<Patient> result = patientRepository.search(filter, page, size);
                List<PatientResponse> items = result.data().stream()
                                .map(this::mapToResponse)
                                .toList();

                return new PageResponse<>(items, result.total(), page, size);
        }

        @Override
        public List<SimpleOption> patientOptions() {

                return patientRepository.findAll().stream()
                                .map(p -> new SimpleOption(
                                                p.getId().toHexString(),
                                                p.getFirstName() + " " + p.getLastName()))
                                .toList();
        }

        private PatientResponse mapToResponse(Patient patient) {
                return new PatientResponse(
                                patient.getId().toHexString(),
                                patient.getPatientCode(),
                                patient.getFirstName(),
                                patient.getLastName(),
                                patient.getFirstName() + " " + patient.getLastName(),
                                patient.getGender(),
                                patient.getDateOfBirth(),
                                patient.getBloodGroup(),
                                patient.getContact().getPhone(),
                                patient.getContact().getEmail(),
                                patient.getContact().getAddress(),
                                patient.getStatus());
        }

}
