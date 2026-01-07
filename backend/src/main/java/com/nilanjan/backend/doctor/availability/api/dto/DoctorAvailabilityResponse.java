package com.nilanjan.backend.doctor.availability.api.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record DoctorAvailabilityResponse(
        String id,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        int slotMinutes) {

}
