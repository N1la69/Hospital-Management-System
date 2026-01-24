package com.nilanjan.backend.appointment.api.dto;

import java.time.Instant;

public record DoctorPatientSearchFilter(
        String searchText,
        Instant fromDate,
        Instant toDate) {

}
