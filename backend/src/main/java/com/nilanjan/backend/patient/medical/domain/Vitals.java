package com.nilanjan.backend.patient.medical.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vitals {

    private Double height;
    private Double weight;
    private String bloodPressure;
    private Double temperature;
    private Integer pulse;
    private Integer oxygenSaturation;
}
