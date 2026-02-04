package com.nilanjan.backend.pharmacist.application;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.auth.application.UserAccountService;
import com.nilanjan.backend.auth.domain.Role;
import com.nilanjan.backend.auth.domain.User;
import com.nilanjan.backend.auth.repository.UserRepository;
import com.nilanjan.backend.common.ContactInfo;
import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.pharmacist.api.dto.CreatePharmacistRequest;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistResponse;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistSearchFilter;
import com.nilanjan.backend.pharmacist.api.dto.UpdatePharmacistRequest;
import com.nilanjan.backend.pharmacist.domain.Pharmacist;
import com.nilanjan.backend.pharmacist.domain.PharmacistStatus;
import com.nilanjan.backend.pharmacist.repository.PharmacistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PharmacistServiceImpl implements PharmacistService {

        private final PharmacistRepository pharmacistRepository;
        private final UserAccountService userAccountService;
        private final UserRepository userRepository;

        @Override
        public PharmacistResponse createPharmacist(CreatePharmacistRequest request) {

                User user = userAccountService.createUser(request.username(), request.email(), request.password(),
                                Set.of(Role.PHARMACIST));

                Pharmacist pharmacist = Pharmacist.builder()
                                .pharmacistCode(PharmacistCodeGenerator.generate())
                                .firstName(request.firstName())
                                .lastName(request.lastName())
                                .contact(ContactInfo.builder()
                                                .phone(request.phone())
                                                .email(request.email())
                                                .address(request.address())
                                                .build())
                                .linkedUserId(user.getId())
                                .status(PharmacistStatus.ACTIVE)
                                .createdAt(Instant.now())
                                .build();

                Pharmacist saved = pharmacistRepository.save(pharmacist);

                return mapToResponse(saved);
        }

        @Override
        public PharmacistResponse updatePharmacist(String pharmacistId, UpdatePharmacistRequest request) {

                Pharmacist pharmacist = pharmacistRepository.findById(new ObjectId(pharmacistId))
                                .orElseThrow(() -> new RuntimeException("Pharmacist not found: " + pharmacistId));

                pharmacist.setFirstName(request.firstName());
                pharmacist.setLastName(request.lastName());

                ContactInfo contact = pharmacist.getContact();
                contact.setPhone(request.phone());
                contact.setEmail(request.email());
                contact.setAddress(request.address());

                Pharmacist saved = pharmacistRepository.save(pharmacist);

                return mapToResponse(saved);
        }

        @Override
        public void deletePharmacist(String pharmacistId) {

                Pharmacist pharmacist = pharmacistRepository.findById(new ObjectId(pharmacistId))
                                .orElseThrow(() -> new RuntimeException("Pharmacist not found: " + pharmacistId));

                ObjectId linkedUserId = pharmacist.getLinkedUserId();

                pharmacistRepository.deleteById(pharmacist.getId());

                if (linkedUserId != null)
                        userRepository.deleteById(linkedUserId);
        }

        @Override
        public PharmacistResponse getPharmacistDetails(String pharmacistId) {

                Pharmacist pharmacist = pharmacistRepository.findById(new ObjectId(pharmacistId))
                                .orElseThrow(() -> new RuntimeException("Pharmacist not found: " + pharmacistId));

                return mapToResponse(pharmacist);
        }

        @Override
        public List<PharmacistResponse> getAllPharmacists() {

                return pharmacistRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        @Override
        public PageResponse<PharmacistResponse> advancedSearch(PharmacistSearchFilter filter, int page, int size) {

                PageResult<Pharmacist> result = pharmacistRepository.search(filter, page, size);
                List<PharmacistResponse> items = result.data().stream()
                                .map(this::mapToResponse)
                                .toList();

                return new PageResponse<>(items, result.total(), page, size);
        }

        // HELPERS
        private PharmacistResponse mapToResponse(Pharmacist pharmacist) {
                return new PharmacistResponse(
                                pharmacist.getId().toHexString(),
                                pharmacist.getPharmacistCode(),
                                pharmacist.getFirstName(),
                                pharmacist.getLastName(),
                                pharmacist.getFirstName() + " " + pharmacist.getLastName(),
                                pharmacist.getContact().getPhone(),
                                pharmacist.getContact().getEmail(),
                                pharmacist.getContact().getAddress(),
                                pharmacist.getStatus());
        }

}
