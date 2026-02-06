package com.nilanjan.backend.pharmacy.api.dto;

import java.math.BigDecimal;

import com.nilanjan.backend.pharmacy.domain.MedicineCategory;
import com.nilanjan.backend.pharmacy.domain.MedicineStatus;

public record UpdateMedicineRequest(
        String medicineName,
        String manufacturerName,
        MedicineCategory category,
        BigDecimal sellingPrice,
        Integer reorderLevel,
        MedicineStatus status) {

}
