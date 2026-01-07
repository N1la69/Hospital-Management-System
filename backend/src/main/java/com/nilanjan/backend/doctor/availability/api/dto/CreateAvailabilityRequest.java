package com.nilanjan.backend.doctor.availability.api.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record CreateAvailabilityRequest(
        String doctorId,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        int slotMinutes) {

}
