package com.nilanjan.backend.receptionist.domain;

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
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "receptionist")
public class Receptionist {

    @Id
    private ObjectId id;

    private String receptionistCode;

    private String firstName;
    private String lastName;

    private ContactInfo contact;

    private ObjectId linkedUserId;

    private ReceptionistStatus status;
    private Instant createdAt;
}
