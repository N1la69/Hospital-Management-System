package com.nilanjan.backend.appointment.application;

import java.util.List;
import java.util.Map;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.AppointmentSearchFilter;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;
import com.nilanjan.backend.appointment.api.dto.DoctorPatientRowResponse;
import com.nilanjan.backend.appointment.api.dto.DoctorPatientSearchFilter;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;
import com.nilanjan.backend.common.dto.PageResponse;

public interface AppointmentService {

    AppointmentResponse bookAppointment(CreateAppointmentRequest request);

    void updateStatus(String appointmentId, AppointmentStatus newStatus, String reason);

    void cancelAppointment(String appointmentId, String reason);

    Map<String, List<AppointmentResponse>> getMyAppointments();

    List<AppointmentResponse> getAppointments();

    PageResponse<AppointmentResponse> advancedSearch(AppointmentSearchFilter filter, int page, int size);

    PageResponse<DoctorPatientRowResponse> getMyPatients(DoctorPatientSearchFilter filter, int page, int size);

}
