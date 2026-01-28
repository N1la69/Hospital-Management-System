package com.nilanjan.backend.appointment.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;

public interface AppointmentRepository extends MongoRepository<Appointment, ObjectId>, AppointmentSearchRepository {
        List<Appointment> findByDoctorIdAndStatusIn(ObjectId doctorId, List<AppointmentStatus> statuses);

        List<Appointment> findByPatientIdAndStatus(ObjectId patientId, AppointmentStatus status);

        void deleteByPatientIdAndStatus(ObjectId patientId, AppointmentStatus status);

        Optional<Appointment> findTopByPatientIdOrderByScheduledStartDesc(ObjectId patientId);

        List<Appointment> findByDoctorIdAndStatusInAndScheduledStartLessThanAndScheduledEndGreaterThan(
                        ObjectId doctorId,
                        List<AppointmentStatus> statuses,
                        Instant end,
                        Instant start);

        List<Appointment> findByPatientIdAndStatusInAndScheduledStartLessThanAndScheduledEndGreaterThan(
                        ObjectId patientId,
                        List<AppointmentStatus> statuses,
                        Instant end,
                        Instant start);
}
