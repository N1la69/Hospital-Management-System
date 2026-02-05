package com.nilanjan.backend.pharmacy.domain;

import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "stock_transactions")
public class StockTransaction {

    @Id
    private ObjectId id;

    private ObjectId medicineId;
    private ObjectId batchId;

    private StockTransactionType type;

    private Integer quantity;

    private ObjectId billId; // when OUT via billing

    private String remark;

    private Instant timestamp;

    private ObjectId userId;
}
