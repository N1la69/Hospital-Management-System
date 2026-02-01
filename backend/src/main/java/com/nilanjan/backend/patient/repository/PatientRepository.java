package com.nilanjan.backend.patient.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.nilanjan.backend.patient.domain.Patient;

public interface PatientRepository extends MongoRepository<Patient, ObjectId>, PatientSearchRepository {

    @Query("{ $or: [ { firstName: { $regex: ?0, $options: 'i' } }, { lastName:  { $regex: ?0, $options: 'i' } }, { patientCode: { $regex: ?0, $options: 'i' } } ] }")
    List<Patient> searchByNameOrCode(String text);
}
