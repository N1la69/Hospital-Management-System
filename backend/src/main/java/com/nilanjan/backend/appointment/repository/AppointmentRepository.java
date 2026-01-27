package com.nilanjan.backend.appointment.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;

public interface AppointmentRepository extends MongoRepository<Appointment, ObjectId>, AppointmentSearchRepository {
        List<Appointment> findByDoctorIdAndStatus(ObjectId doctorId, AppointmentStatus status);

        List<Appointment> findByPatientIdAndStatus(ObjectId patientId, AppointmentStatus status);

        void deleteByPatientIdAndStatus(ObjectId patientId, AppointmentStatus status);

        List<Appointment> findByDoctorIdAndScheduledStartLessThanAndScheduledEndGreaterThan(
                        ObjectId doctorId,
                        Instant end,
                        Instant start);

        Optional<Appointment> findTopByPatientIdOrderByScheduledStartDesc(ObjectId patientId);

        List<Appointment> findByPatientIdAndScheduledStartLessThanAndScheduledEndGreaterThan(
                        ObjectId patientId,
                        Instant end,
                        Instant start);
}
