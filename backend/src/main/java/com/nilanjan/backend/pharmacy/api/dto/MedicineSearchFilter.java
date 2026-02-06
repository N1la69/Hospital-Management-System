package com.nilanjan.backend.pharmacy.api.dto;

import com.nilanjan.backend.pharmacy.domain.MedicineCategory;
import com.nilanjan.backend.pharmacy.domain.MedicineStatus;

public record MedicineSearchFilter(
                String name,
                MedicineCategory category,
                MedicineStatus status) {

}
