package com.nilanjan.backend.pharmacy.domain;

import java.math.BigDecimal;

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
@Document(collection = "medicines")
public class Medicine {

    @Id
    private ObjectId id;

    private String name;
    private String manufacturer;

    private MedicineCategory category;

    private BigDecimal cgstPercent;
    private BigDecimal sgstPercent;

    private BigDecimal sellingPrice;

    private Integer reorderLevel;

    private MedicineStatus status;
}
