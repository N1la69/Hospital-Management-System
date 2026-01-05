package com.nilanjan.backend.patient.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "patients")
public class Patient {
    
    @Id
    private ObjectId id;

    private String patientString;

    private String firstName;
    private String lastName;

    private Gender gender;
    private LocalDate dateOfBirth;

    private BloodGroup bloodGroup;
    private ContactInfo contact;

    private ObjectId linkedUserId;
    private Set<ObjectId> assignedDoctorIds;

    private PatientStatus status;
    private Instant createdAt;
}
