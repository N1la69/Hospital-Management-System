package com.nilanjan.backend.doctor.domain;

import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.nilanjan.backend.common.ContactInfo;

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
@Document(collection = "doctors")
public class Doctor {

    @Id
    private ObjectId id;

    private String doctorCode;

    private String firstName;
    private String lastName;

    private Specialization specialization;
    private String qualification;
    private int experienceYears;

    private int consultationFees;

    private ContactInfo contact;

    private ObjectId linkedUserId;

    private DoctorStatus status;

    private Instant createdAt;
}
