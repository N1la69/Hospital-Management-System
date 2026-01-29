package com.nilanjan.backend.billing.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bills")
public class Bill {

    @Id
    private ObjectId id;

    private String billNumber;
    private ObjectId patientId;
    private ObjectId appointmentId;

    private List<BillItem> items;

    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private BigDecimal amountPaid;

    private BillStatus status;

    private Instant createdAt;
    private Instant updatedAt;

    private List<Payment> payments;

}
