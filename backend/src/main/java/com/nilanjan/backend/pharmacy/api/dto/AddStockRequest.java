package com.nilanjan.backend.pharmacy.api.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AddStockRequest(
        String medicineId,
        Instant mfgDate,
        Instant expiryDate,
        Integer quantity,
        BigDecimal costPrice,
        String supplier) {

}
