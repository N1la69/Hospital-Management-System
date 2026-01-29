package com.nilanjan.backend.billing.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.nilanjan.backend.billing.domain.BillItem;
import com.nilanjan.backend.billing.domain.BillStatus;
import com.nilanjan.backend.billing.domain.Payment;

public record BillingResponse(
                String id,
                String billNumber,

                String patientId,
                String patientCode,
                String patientName,

                String appointmentId,
                String appointmentCode,

                String doctorId,
                String doctorCode,
                String doctorName,

                List<BillItem> items,

                BigDecimal subtotal,
                BigDecimal tax,
                BigDecimal discount,
                BigDecimal totalAmount,
                BigDecimal amountPaid,

                BillStatus status,
                Instant updatedAt,

                List<Payment> payments) {

}
