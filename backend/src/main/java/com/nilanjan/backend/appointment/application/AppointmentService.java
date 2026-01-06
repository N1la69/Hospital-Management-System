package com.nilanjan.backend.appointment.application;

import java.util.List;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;

public interface AppointmentService {

    AppointmentResponse bookAppointment(CreateAppointmentRequest request);

    AppointmentResponse getAppointmentById(String appointmentId);

    List<AppointmentResponse> getMyAppointments();

    void cancelAppointment(String appointmentId);
}
