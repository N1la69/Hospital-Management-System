package com.nilanjan.backend.receptionist.api.dto;

import com.nilanjan.backend.receptionist.domain.ReceptionistStatus;

public record ReceptionistResponse(
        String id,
        String receptionistCode,
        String firstName,
        String lastName,
        String fullName,
        String phone,
        String email,
        String address,
        ReceptionistStatus status) {

}
