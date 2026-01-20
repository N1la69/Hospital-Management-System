package com.nilanjan.backend.receptionist.application;

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
import com.nilanjan.backend.receptionist.api.dto.CreateReceptionistRequest;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistResponse;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistSearchFilter;
import com.nilanjan.backend.receptionist.api.dto.UpdateReceptionistRequest;
import com.nilanjan.backend.receptionist.domain.Receptionist;
import com.nilanjan.backend.receptionist.domain.ReceptionistStatus;
import com.nilanjan.backend.receptionist.repository.ReceptionistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReceptionistServiceImpl implements ReceptionistService {

        private final ReceptionistRepository receptionistRepository;
        private final UserAccountService userAccountService;
        private final UserRepository userRepository;

        @Override
        public ReceptionistResponse createReceptionist(CreateReceptionistRequest request) {

                User user = userAccountService.createUser(request.username(), request.email(), request.password(),
                                Set.of(Role.RECEPTIONIST));

                Receptionist receptionist = Receptionist.builder()
                                .receptionistCode(ReceptionistCodeGenerator.generate())
                                .firstName(request.firstName())
                                .lastName(request.lastName())
                                .contact(ContactInfo.builder()
                                                .phone(request.phone())
                                                .email(request.email())
                                                .address(request.address())
                                                .build())
                                .linkedUserId(user.getId())
                                .status(ReceptionistStatus.ACTIVE)
                                .createdAt(Instant.now())
                                .build();

                Receptionist saved = receptionistRepository.save(receptionist);

                return mapToResponse(saved);
        }

        @Override
        public ReceptionistResponse updateReceptionist(String receptionistId, UpdateReceptionistRequest request) {

                Receptionist receptionist = receptionistRepository.findById(new ObjectId(receptionistId))
                                .orElseThrow(() -> new RuntimeException("Receptionist not found: " + receptionistId));

                receptionist.setFirstName(request.firstName());
                receptionist.setLastName(request.lastName());

                ContactInfo contact = receptionist.getContact();
                contact.setPhone(request.phone());
                contact.setEmail(request.email());
                contact.setAddress(request.address());

                Receptionist saved = receptionistRepository.save(receptionist);

                return mapToResponse(saved);
        }

        @Override
        public void deleteReceptionist(String receptionistId) {

                Receptionist receptionist = receptionistRepository.findById(new ObjectId(receptionistId))
                                .orElseThrow(() -> new RuntimeException("Receptionist not found: " + receptionistId));

                ObjectId linkedUserId = receptionist.getLinkedUserId();

                receptionistRepository.deleteById(receptionist.getId());

                if (linkedUserId != null)
                        userRepository.deleteById(linkedUserId);
        }

        @Override
        public List<ReceptionistResponse> getAllReceptionists() {

                return receptionistRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public PageResponse<ReceptionistResponse> advancedSearch(ReceptionistSearchFilter filter, int page, int size) {

                PageResult<Receptionist> result = receptionistRepository.search(filter, page, size);
                List<ReceptionistResponse> items = result.data().stream()
                                .map(this::mapToResponse)
                                .toList();

                return new PageResponse<>(items, result.total(), page, size);
        }

        private ReceptionistResponse mapToResponse(Receptionist receptionist) {
                return new ReceptionistResponse(
                                receptionist.getId().toHexString(),
                                receptionist.getReceptionistCode(),
                                receptionist.getFirstName(),
                                receptionist.getLastName(),
                                receptionist.getFirstName() + " " + receptionist.getLastName(),
                                receptionist.getContact().getPhone(),
                                receptionist.getContact().getEmail(),
                                receptionist.getContact().getAddress(),
                                receptionist.getStatus());
        }

}
