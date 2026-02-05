package com.nilanjan.backend.pharmacy.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.nilanjan.backend.pharmacy.domain.StockTransaction;

public interface StockTransactionRepository extends MongoRepository<StockTransaction, ObjectId> {

    List<StockTransaction> findByBillId(ObjectId billId);
}
