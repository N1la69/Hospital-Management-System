package com.nilanjan.backend.billing.domain;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillItem {

    private String description;
    private BillItemType type;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
