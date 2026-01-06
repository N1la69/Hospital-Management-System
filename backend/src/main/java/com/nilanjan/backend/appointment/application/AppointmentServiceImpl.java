package com.nilanjan.backend.appointment.application;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;
import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;
import com.nilanjan.backend.appointment.event.AppointmentBookedEvent;
import com.nilanjan.backend.appointment.repository.AppointmentRepository;
import com.nilanjan.backend.doctor.repository.DoctorRepository;
import com.nilanjan.backend.patient.repository.PatientRepository;
import com.nilanjan.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public AppointmentResponse bookAppointment(CreateAppointmentRequest request) {

        Instant start = request.scheduledStart();
        Instant end = request.scheduledEnd();

        if (start.isAfter(end) || start.equals(end))
            throw new RuntimeException("Invalid Appointment Window");

        ObjectId patientId = new ObjectId(request.patientId());
        ObjectId doctorId = new ObjectId(request.doctorId());

        if (patientRepository.findById(patientId).isEmpty())
            throw new RuntimeException("Patient not found");

        if (doctorRepository.findById(doctorId).isEmpty())
            throw new RuntimeException("Doctor not found");

        if (!appointmentRepository
                .findByDoctorIdAndScheduledStartLessThanAndScheduledEndGreaterThan(doctorId, end, start).isEmpty())
            throw new RuntimeException("Doctor is not available in this time slot");

        if (!appointmentRepository
                .findByPatientIdAndScheduledStartLessThanAndScheduledEndGreaterThan(patientId, end, start).isEmpty())
            throw new RuntimeException("Patient already has an appointment in this time slot");

        Appointment appointment = Appointment.builder()
                .appointmentCode(AppointmentCodeGenerator.generate())
                .patientId(patientId)
                .doctorId(doctorId)
                .scheduledStart(start)
                .scheduledEnd(end)
                .reason(request.reason())
                .status(AppointmentStatus.SCHEDULED)
                .createdBy(SecurityUtil.currentUserId())
                .createdAt(Instant.now())
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        eventPublisher
                .publishEvent(new AppointmentBookedEvent(saved.getId().toHexString(), saved.getAppointmentCode()));

        return mapToResponse(appointment);
    }

    @Override
    public AppointmentResponse getAppointmentById(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(new ObjectId(appointmentId))
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        return mapToResponse(appointment);
    }

    @Override
    public List<AppointmentResponse> getMyAppointments() {
        ObjectId currentUserId = SecurityUtil.currentUserId();

        List<Appointment> appointments;

        if (SecurityUtil.hasRole("DOCTOR"))
            appointments = appointmentRepository.findByDoctorIdAndStatus(currentUserId, AppointmentStatus.SCHEDULED);
        else
            appointments = appointmentRepository.findByPatientIdAndStatus(currentUserId, AppointmentStatus.SCHEDULED);

        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelAppointment(String appointmentId) {

        Appointment appointment = appointmentRepository.findById(new ObjectId(appointmentId))
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        appointment.setStatus(AppointmentStatus.CANCELED);
        appointmentRepository.save(appointment);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId().toHexString(),
                appointment.getAppointmentCode(),
                appointment.getPatientId().toHexString(),
                appointment.getDoctorId().toHexString(),
                appointment.getScheduledStart(),
                appointment.getScheduledEnd(),
                appointment.getStatus());
    }

}
