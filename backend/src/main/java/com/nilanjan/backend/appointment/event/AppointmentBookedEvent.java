package com.nilanjan.backend.appointment.event;

public record AppointmentBookedEvent(
        String appointmentId,
        String appointmentCode) {

}
