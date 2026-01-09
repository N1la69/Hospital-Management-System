package com.nilanjan.backend.appointment.domain;

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
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "appointments")
public class Appointment {

    @Id
    private ObjectId id;

    private String appointmentCode;

    private ObjectId patientId;
    private ObjectId doctorId;

    private Instant scheduledStart;
    private Instant scheduledEnd;

    private String reason;

    private AppointmentStatus status;

    private ObjectId createdBy;
    private Instant createdAt;

    private Instant checkedInAt;
    private Instant startedAt;
    private Instant completedAt;
    private Instant cancelledAt;
    private String cancelledByRole;
    private String cancelledReason;
}
