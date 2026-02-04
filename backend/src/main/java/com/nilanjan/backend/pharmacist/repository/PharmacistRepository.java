package com.nilanjan.backend.pharmacist.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.pharmacist.domain.Pharmacist;

public interface PharmacistRepository extends MongoRepository<Pharmacist, ObjectId>, PharmacistSearchRepository {

    Optional<Pharmacist> findByLinkedUserId(ObjectId linkedUserId);
}
