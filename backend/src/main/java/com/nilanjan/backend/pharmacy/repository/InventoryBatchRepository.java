package com.nilanjan.backend.pharmacy.repository;

import java.time.LocalDate;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.pharmacy.domain.InventoryBatch;

public interface InventoryBatchRepository extends MongoRepository<InventoryBatch, ObjectId> {

    List<InventoryBatch> findByMedicineIdAndQuantityAvailableGreaterThan(
            ObjectId medicineId, int qty);

    List<InventoryBatch> findByExpiryDateBefore(LocalDate date);
}
