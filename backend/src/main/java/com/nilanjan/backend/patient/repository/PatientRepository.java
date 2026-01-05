package com.nilanjan.backend.patient.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.patient.domain.Patient;

public interface PatientRepository extends MongoRepository<Patient, ObjectId> {
    List<Patient> findByFirstNameContainingIgnoreCase(String firstName);
    List<Patient> findByContact_Phone(String phone);
}
