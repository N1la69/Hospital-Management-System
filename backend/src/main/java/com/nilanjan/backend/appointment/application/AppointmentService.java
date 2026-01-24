package com.nilanjan.backend.appointment.application;

import java.util.List;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.AppointmentSearchFilter;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;
import com.nilanjan.backend.appointment.api.dto.DoctorPatientRowResponse;
import com.nilanjan.backend.appointment.api.dto.DoctorPatientSearchFilter;
import com.nilanjan.backend.common.dto.PageResponse;

public interface AppointmentService {

    AppointmentResponse bookAppointment(CreateAppointmentRequest request);

    List<AppointmentResponse> getMyAppointments();

    List<AppointmentResponse> getAppointments();

    PageResponse<AppointmentResponse> advancedSearch(AppointmentSearchFilter filter, int page, int size);

    PageResponse<DoctorPatientRowResponse> getMyPatients(DoctorPatientSearchFilter filter, int page, int size);

    void checkInAppointment(String appointmentId);

    void startAppointment(String appointmentId);

    void completeAppointment(String appointmentId);

    void cancelAppointment(String appointmentId, String reason);

    void markNoShow(String appointmentId);

}
