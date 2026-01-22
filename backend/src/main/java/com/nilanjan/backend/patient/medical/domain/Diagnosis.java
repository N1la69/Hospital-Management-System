package com.nilanjan.backend.patient.medical.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis {

    private String primaryDiagnosis;
    private List<String> secondaryDiagnosis;
    private List<String> symptoms;
    private String clinicalNotes;
}
