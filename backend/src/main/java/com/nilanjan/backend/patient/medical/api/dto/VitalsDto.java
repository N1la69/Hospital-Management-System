package com.nilanjan.backend.patient.medical.api.dto;

public record VitalsDto(
        Double height,
        Double weight,
        String bloodPressure,
        Double temperature,
        Integer pulse,
        Integer oxygenSaturation) {

}
