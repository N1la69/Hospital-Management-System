package com.nilanjan.backend.pharmacy.api.dto;

import java.math.BigDecimal;

import com.nilanjan.backend.pharmacy.domain.MedicineCategory;
import com.nilanjan.backend.pharmacy.domain.MedicineStatus;

public record MedicineResponse(
        String id,
        String name,
        String manufacturer,
        MedicineCategory category,
        BigDecimal cgstPercent,
        BigDecimal sgstPercent,
        BigDecimal sellingPrice,
        Integer reorderLevel,
        MedicineStatus status) {

}
