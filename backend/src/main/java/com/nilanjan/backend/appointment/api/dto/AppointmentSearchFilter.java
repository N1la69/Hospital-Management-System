package com.nilanjan.backend.appointment.api.dto;

import java.time.DayOfWeek;
import java.time.Instant;

import com.nilanjan.backend.appointment.domain.AppointmentStatus;

public record AppointmentSearchFilter(
        String appointmentCode,
        String patientName,
        String doctorName,
        AppointmentStatus status,
        Instant fromTime,
        Instant toTime,
        DayOfWeek day,
        Instant date) {

}
