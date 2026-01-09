package com.nilanjan.backend.appointment.application;

import java.util.List;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;

public interface AppointmentService {

    AppointmentResponse bookAppointment(CreateAppointmentRequest request);

    AppointmentResponse getAppointmentById(String appointmentId);

    List<AppointmentResponse> getMyAppointments();

    void checkInAppointment(String appointmentId);

    void startAppointment(String appointmentId);

    void completeAppointment(String appointmentId);

    void cancelAppointment(String appointmentId, String reason);

    void markNoShow(String appointmentId);

}
