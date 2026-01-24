package com.nilanjan.backend.patient.medical.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.patient.medical.domain.MedicalRecord;

public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, ObjectId> {

    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(ObjectId patientId);

}
