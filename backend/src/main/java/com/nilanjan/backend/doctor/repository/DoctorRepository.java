package com.nilanjan.backend.doctor.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.doctor.domain.Doctor;
import java.util.List;

public interface DoctorRepository extends MongoRepository<Doctor, ObjectId> {
    List<Doctor> findBySpecialization(String specialization);
}
