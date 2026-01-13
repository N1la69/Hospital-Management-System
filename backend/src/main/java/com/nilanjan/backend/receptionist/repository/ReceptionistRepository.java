package com.nilanjan.backend.receptionist.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.receptionist.domain.Receptionist;

public interface ReceptionistRepository extends MongoRepository<Receptionist, ObjectId>, ReceptionistSearchRepository {

    Optional<Receptionist> findByLinkedUserId(ObjectId linkedUserId);

    Optional<Receptionist> findByReceptionistCode(String receptionistCode);
}
