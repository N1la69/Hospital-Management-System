package com.nilanjan.backend.patient.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.patient.domain.Patient;

public interface PatientRepository extends MongoRepository<Patient, ObjectId>, PatientSearchRepository {

}
