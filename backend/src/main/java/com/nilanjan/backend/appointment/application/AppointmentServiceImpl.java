package com.nilanjan.backend.appointment.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    @Override
    public AppointmentResponse bookAppointment(CreateAppointmentRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'bookAppointment'");
    }

    @Override
    public AppointmentResponse getAppointmentById(String appointmentId) {
        throw new UnsupportedOperationException("Unimplemented method 'getAppointmentById'");
    }

    @Override
    public List<AppointmentResponse> getMyAppointments() {
        throw new UnsupportedOperationException("Unimplemented method 'getMyAppointments'");
    }

    @Override
    public void cancelAppointment(String appointmentId) {
        throw new UnsupportedOperationException("Unimplemented method 'cancelAppointment'");
    }

}
