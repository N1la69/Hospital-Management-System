package com.nilanjan.backend.pharmacist.domain;

import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.nilanjan.backend.common.ContactInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "pharmacists")
public class Pharmacist {

    @Id
    private ObjectId id;

    private String pharmacistCode;

    private String firstName;
    private String lastName;

    private ContactInfo contact;

    private ObjectId linkedUserId;

    private PharmacistStatus status;
    private Instant createdAt;
}
