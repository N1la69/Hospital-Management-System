package com.nilanjan.backend.billing.api.dto;

import java.math.BigDecimal;

import com.nilanjan.backend.billing.domain.BillItemType;

public record AddBillItemRequest(
        String description,
        BillItemType type,
        Integer quantity,
        BigDecimal unitPrice) {

}
