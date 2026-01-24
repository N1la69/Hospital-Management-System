package com.nilanjan.backend.appointment.api.dto;

import java.time.Instant;

public record DoctorPatientRowResponse(
        String patientCode,
        String appointmentCode,
        String patientName,
        Instant appointmentDateTime) {

}
