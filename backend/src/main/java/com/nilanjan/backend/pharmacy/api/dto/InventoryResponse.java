package com.nilanjan.backend.pharmacy.api.dto;

import java.time.Instant;

public record InventoryResponse(
        String medicineId,
        String batchNo,
        Instant mfgDate,
        Instant expiryDate,
        Integer quantityAvailable,
        String supplier) {

}
