package com.nilanjan.backend.doctor.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.nilanjan.backend.doctor.domain.Doctor;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends MongoRepository<Doctor, ObjectId>, DoctorSearchRepository {
    List<Doctor> findBySpecialization(String specialization);

    Optional<Doctor> findByLinkedUserId(ObjectId linkedUserId);

    @Query("{ $or: [ { firstName: { $regex: ?0, $options: 'i' } }, { lastName: { $regex: ?0, $options: 'i' } } ] }")
    List<Doctor> searchByName(String name);

}
