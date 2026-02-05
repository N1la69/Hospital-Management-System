package com.nilanjan.backend.pharmacy.domain;

import java.math.BigDecimal;
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
@Document(collection = "inventory_batches")
public class InventoryBatch {

    @Id
    private ObjectId id;

    private ObjectId medicineId;

    private String batchNo;

    private Instant mfgDate;
    private Instant expiryDate;

    private Integer quantityAvailable;

    private BigDecimal costPrice;
    private BigDecimal sellingPrice;

    private String supplier;
}
