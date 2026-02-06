package com.nilanjan.backend.billing.api.dto;

import java.util.List;

public record CreateBillRequest(
        String patientId,
        String walkInName,
        String appointmentId,
        List<AddBillItemRequest> items) {

}
