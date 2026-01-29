package com.nilanjan.backend.billing.domain;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    private String id;

    private BigDecimal amount;
    private String method; // CASH, UPI, CARD
    private Instant paidAt;
    private String reference;
}
