package com.nilanjan.backend.doctor.availability.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.doctor.availability.domain.DoctorAvailability;

import java.time.DayOfWeek;
import java.util.List;

public interface DoctorAvailabilityRepository extends MongoRepository<DoctorAvailability, ObjectId> {
    List<DoctorAvailability> findByDoctorId(ObjectId doctorId);

    List<DoctorAvailability> findByDayOfWeek(DayOfWeek dayOfWeek);

    List<DoctorAvailability> findByDoctorIdAndDayOfWeek(ObjectId doctorId, DayOfWeek dayOfWeek);

    void deleteByDoctorId(ObjectId doctorId);
}
