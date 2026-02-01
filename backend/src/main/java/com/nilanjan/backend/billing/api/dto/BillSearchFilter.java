package com.nilanjan.backend.billing.api.dto;

public record BillSearchFilter(
        String name, // Patient name + code, Doctor name + code, Appointment code, Bill number
        String paymentStatus,
        String paymentMethod,
        String fromDate,
        String toDate) {

}
