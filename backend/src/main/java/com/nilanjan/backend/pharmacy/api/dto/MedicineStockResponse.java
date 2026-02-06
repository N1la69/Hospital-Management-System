package com.nilanjan.backend.pharmacy.api.dto;

public record MedicineStockResponse(
        MedicineResponse medicine,
        InventoryResponse stock) {

}
