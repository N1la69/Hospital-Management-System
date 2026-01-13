package com.nilanjan.backend.receptionist.api.dto;

import com.nilanjan.backend.receptionist.domain.ReceptionistStatus;

public record ReceptionistSearchFilter(
        String name,
        String receptionistCode,
        String email,
        ReceptionistStatus status) {

}
