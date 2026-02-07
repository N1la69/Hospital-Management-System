package com.nilanjan.backend.billing.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record CreateBillRequest(
                String patientId,
                String walkInName,
                String appointmentId,
                BigDecimal tax,
                List<AddBillItemRequest> items) {

}
