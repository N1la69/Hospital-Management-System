package com.nilanjan.backend.pharmacy.api.dto;

import java.math.BigDecimal;

import com.nilanjan.backend.pharmacy.domain.MedicineCategory;

public record UpdateMedicineRequest(
        String name,
        String manufacturer,
        MedicineCategory category,
        String unit,
        BigDecimal defaultPrice,
        BigDecimal cgstPercent,
        BigDecimal sgstPercent,
        BigDecimal sellingPrice,
        Integer reorderLevel,
        boolean active) {

}
