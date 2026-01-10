package com.nilanjan.backend.doctor.availability.domain;

import java.time.DayOfWeek;
import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "doctor_availability")
public class DoctorAvailability {

    @Id
    private ObjectId id;

    private ObjectId doctorId;

    private DayOfWeek dayOfWeek;

    private Instant startTime;
    private Instant endTime;

    private int slotMinutes;
}
