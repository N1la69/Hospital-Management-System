package com.nilanjan.backend.appointment.repository;

import java.time.Instant;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;

public interface AppointmentRepository extends MongoRepository<Appointment, ObjectId> {
    List<Appointment> findByDoctorIdAndStatus(ObjectId doctorId, AppointmentStatus status);

    List<Appointment> findByPatientIdAndStatus(ObjectId patientId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndScheduledStartLessThanAndScheduledEndGreaterThan(
            ObjectId doctorId,
            Instant end,
            Instant start);

    List<Appointment> findByPatientIdAndScheduledStartLessThanAndScheduledEndGreaterThan(
            ObjectId patientId,
            Instant end,
            Instant start);
}
