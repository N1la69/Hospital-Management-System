package com.nilanjan.backend.billing.api.dto;

import java.math.BigDecimal;

public record PaymentRequest(
        BigDecimal amount,
        String method,
        String reference) {

}
