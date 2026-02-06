package com.nilanjan.backend.pharmacy.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.pharmacy.domain.InventoryBatch;

public interface InventoryBatchRepository extends MongoRepository<InventoryBatch, ObjectId> {

    List<InventoryBatch> findByMedicineIdAndQuantityAvailableGreaterThan(
            ObjectId medicineId, int qty);

    Optional<InventoryBatch> findByMedicineId(ObjectId medicineId);
}
