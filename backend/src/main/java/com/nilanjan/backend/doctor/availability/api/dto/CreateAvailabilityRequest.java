package com.nilanjan.backend.doctor.availability.api.dto;

import java.time.DayOfWeek;
import java.time.Instant;

public record CreateAvailabilityRequest(
                String doctorId,
                DayOfWeek dayOfWeek,
                Instant startTime,
                Instant endTime,
                int slotMinutes) {

}
