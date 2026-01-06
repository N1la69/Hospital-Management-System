package com.nilanjan.backend.appointment.api.dto;

import java.time.Instant;

public record CreateAppointmentRequest(
        String patientId,
        String doctorId,
        Instant scheduledStart,
        Instant scheduledEnd,
        String reason) {

}
