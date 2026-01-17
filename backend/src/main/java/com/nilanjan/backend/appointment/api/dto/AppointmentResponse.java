package com.nilanjan.backend.appointment.api.dto;

import java.time.Instant;

import com.nilanjan.backend.appointment.domain.AppointmentStatus;

public record AppointmentResponse(
                String id,
                String appointmentCode,
                String patientId,
                String patientName,
                String doctorId,
                String doctorName,
                Instant scheduledStart,
                Instant scheduledEnd,
                AppointmentStatus status) {

}
