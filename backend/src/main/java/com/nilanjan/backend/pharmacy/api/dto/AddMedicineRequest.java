package com.nilanjan.backend.pharmacy.api.dto;

import java.math.BigDecimal;

import com.nilanjan.backend.pharmacy.domain.MedicineCategory;

public record AddMedicineRequest(
                String medicineName,
                String manufacturerName,
                MedicineCategory category,
                BigDecimal sellingPrice,
                Integer reorderLevel) {

}
