package com.nilanjan.backend.patient.api.dto;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;

public record PatientDetailsResponse(
        PatientResponse patient,
        AppointmentResponse lastAppointment) {

}
