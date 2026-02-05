package com.nilanjan.backend.pharmacy.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.pharmacy.domain.Medicine;

public interface MedicineRepository extends MongoRepository<Medicine, ObjectId> {
    List<Medicine> findByNameContainingIgnoreCase(String name);
}
