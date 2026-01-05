package com.nilanjan.backend.doctor.event;

public record DoctorCreatedEvent(
        String doctorId,
        String doctorCode) {

}
