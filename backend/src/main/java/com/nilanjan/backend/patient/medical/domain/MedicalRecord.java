package com.nilanjan.backend.patient.medical.domain;

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
@Document(collection = "medical_histories")
public class MedicalRecord {

    @Id
    private ObjectId id;

    private ObjectId patientId;

    private boolean manualEntry;

    private Instant visitDate;

    private Diagnosis diagnosis;
    private Vitals vitals;
    private List<Medication> medications;

    private String notes;

    private Instant createdAt;
    private Instant updatedAt;
}
