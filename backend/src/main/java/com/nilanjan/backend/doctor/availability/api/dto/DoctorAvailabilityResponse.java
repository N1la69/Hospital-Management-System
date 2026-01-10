package com.nilanjan.backend.doctor.availability.api.dto;

import java.time.DayOfWeek;
import java.time.Instant;

public record DoctorAvailabilityResponse(
                String id,
                DayOfWeek dayOfWeek,
                Instant startTime,
                Instant endTime,
                int slotMinutes) {

}
