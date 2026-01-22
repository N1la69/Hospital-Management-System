package com.nilanjan.backend.patient.medical.api.dto;

public record MedicationDto(
        String name,
        String dosage,
        String frequency,
        String duration) {

}
