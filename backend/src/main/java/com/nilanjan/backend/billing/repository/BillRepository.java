package com.nilanjan.backend.billing.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.billing.domain.Bill;

public interface BillRepository extends MongoRepository<Bill, ObjectId>, BillSearchRepository {

    Optional<Bill> findByBillNumber(String billNumber);

    List<Bill> findByPatientId(ObjectId patientId);
}
