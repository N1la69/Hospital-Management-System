package com.nilanjan.backend.receptionist.api.dto;

import com.nilanjan.backend.receptionist.domain.ReceptionistStatus;

public record ReceptionistResponse(
                String id,
                String receptionistCode,
                String fullName,
                String email,
                ReceptionistStatus status) {

}
