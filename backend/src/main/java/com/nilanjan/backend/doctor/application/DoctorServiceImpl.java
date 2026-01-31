package com.nilanjan.backend.doctor.application;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.application.UserAccountService;
import com.nilanjan.backend.auth.domain.Role;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.auth.repository.UserRepository;
import com.nilanjan.backend.common.ContactInfo;
import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.common.dto.SimpleOption;
import com.nilanjan.backend.doctor.api.dto.CreateDoctorRequest;
import com.nilanjan.backend.doctor.api.dto.DoctorDetailsResponse;
import com.nilanjan.backend.doctor.api.dto.DoctorResponse;
import com.nilanjan.backend.doctor.api.dto.DoctorSearchFilter;
import com.nilanjan.backend.doctor.api.dto.UpdateDoctorRequest;
import com.nilanjan.backend.doctor.availability.api.dto.DoctorAvailabilityResponse;
import com.nilanjan.backend.doctor.availability.repository.DoctorAvailabilityRepository;
import com.nilanjan.backend.doctor.domain.Doctor;
import com.nilanjan.backend.doctor.domain.DoctorStatus;
import com.nilanjan.backend.doctor.repository.DoctorRepository;
import com.nilanjan.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

        private final DoctorRepository doctorRepository;
        private final UserAccountService userAccountService;
        private final UserRepository userRepository;
        private final DoctorAvailabilityRepository doctorAvailabilityRepository;

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
                                .consultationFees(request.consultationFees())
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

                return mapToResponse(saved);
        }

        @Override
        public DoctorResponse updateDoctor(String doctorId, UpdateDoctorRequest request) {

                Doctor doctor = doctorRepository.findById(new ObjectId(doctorId))
                                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

                doctor.setFirstName(request.firstName());
                doctor.setLastName(request.lastName());
                doctor.setSpecialization(request.specialization());
                doctor.setQualification(request.qualification());
                doctor.setExperienceYears(request.experienceYears());
                doctor.setConsultationFees(request.consultationFees());

                ContactInfo contact = doctor.getContact();
                contact.setPhone(request.phone());
                contact.setEmail(request.email());
                contact.setAddress(request.address());

                Doctor saved = doctorRepository.save(doctor);

                return mapToResponse(saved);
        }

        @Override
        public void deleteDoctor(String doctorId) {

                Doctor doctor = doctorRepository.findById(new ObjectId(doctorId))
                                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

                ObjectId linkedUserId = doctor.getLinkedUserId();

                doctorAvailabilityRepository.deleteByDoctorId(doctor.getId());
                doctorRepository.deleteById(doctor.getId());

                if (linkedUserId != null)
                        userRepository.deleteById(linkedUserId);
        }

        @Override
        public DoctorDetailsResponse getDoctorDetails(String doctorId) {

                Doctor doctor = doctorRepository.findById(new ObjectId(doctorId))
                                .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

                DoctorResponse doctorResponse = mapToResponse(doctor);

                List<DoctorAvailabilityResponse> availability = doctorAvailabilityRepository
                                .findByDoctorId(new ObjectId(doctorId))
                                .stream()
                                .map(a -> new DoctorAvailabilityResponse(
                                                a.getId().toHexString(),
                                                a.getDayOfWeek(),
                                                a.getStartTime(),
                                                a.getEndTime(),
                                                a.getSlotMinutes()))
                                .toList();

                return new DoctorDetailsResponse(doctorResponse, availability);
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

        // HELPERS
        private DoctorResponse mapToResponse(Doctor doctor) {
                return new DoctorResponse(
                                doctor.getId().toHexString(),
                                doctor.getDoctorCode(),
                                doctor.getFirstName(),
                                doctor.getLastName(),
                                doctor.getFirstName() + " " + doctor.getLastName(),
                                doctor.getSpecialization(),
                                doctor.getQualification(),
                                doctor.getExperienceYears(),
                                doctor.getConsultationFees(),
                                doctor.getContact().getPhone(),
                                doctor.getContact().getEmail(),
                                doctor.getContact().getAddress(),
                                doctor.getStatus());
        }

}
