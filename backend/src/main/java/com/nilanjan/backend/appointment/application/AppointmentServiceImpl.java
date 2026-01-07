package com.nilanjan.backend.appointment.application;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
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
import com.nilanjan.backend.doctor.availability.domain.DoctorAvailability;
import com.nilanjan.backend.doctor.availability.repository.DoctorAvailabilityRepository;
import com.nilanjan.backend.doctor.repository.DoctorRepository;
import com.nilanjan.backend.patient.repository.PatientRepository;
import com.nilanjan.backend.security.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorAvailabilityRepository doctorAvailabilityRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public AppointmentResponse bookAppointment(CreateAppointmentRequest request) {

        Instant startInstant = request.scheduledStart();
        Instant endInstant = request.scheduledEnd();

        DayOfWeek day = startInstant.atZone(ZoneId.systemDefault()).getDayOfWeek();
        LocalTime startTime = startInstant.atZone(ZoneId.systemDefault()).toLocalTime();
        LocalTime endTime = endInstant.atZone(ZoneId.systemDefault()).toLocalTime();

        if (startInstant.isAfter(endInstant) || startInstant.equals(endInstant))
            throw new RuntimeException("Invalid Appointment Window");

        ObjectId patientId = new ObjectId(request.patientId());
        ObjectId doctorId = new ObjectId(request.doctorId());

        List<DoctorAvailability> availabilities = doctorAvailabilityRepository.findByDoctorIdAndDayOfWeek(doctorId,
                day);

        if (availabilities.isEmpty())
            throw new RuntimeException("Doctor is not available on this day");

        boolean insideAvailability = availabilities.stream().anyMatch(a -> !startTime.isBefore(a.getStartTime()) &&
                !endTime.isAfter(a.getEndTime()) &&
                Duration.between(startTime, endTime).toMinutes() == a.getSlotMinutes());

        if (!insideAvailability)
            throw new RuntimeException("Appointment time outside doctor availability");

        if (patientRepository.findById(patientId).isEmpty())
            throw new RuntimeException("Patient not found");

        if (doctorRepository.findById(doctorId).isEmpty())
            throw new RuntimeException("Doctor not found");

        if (!appointmentRepository
                .findByDoctorIdAndScheduledStartLessThanAndScheduledEndGreaterThan(doctorId, endInstant, startInstant)
                .isEmpty())
            throw new RuntimeException("Doctor is not available in this time slot");

        if (!appointmentRepository
                .findByPatientIdAndScheduledStartLessThanAndScheduledEndGreaterThan(patientId, endInstant, startInstant)
                .isEmpty())
            throw new RuntimeException("Patient already has an appointment in this time slot");

        Appointment appointment = Appointment.builder()
                .appointmentCode(AppointmentCodeGenerator.generate())
                .patientId(patientId)
                .doctorId(doctorId)
                .scheduledStart(startInstant)
                .scheduledEnd(endInstant)
                .reason(request.reason())
                .status(AppointmentStatus.SCHEDULED)
                .createdBy(SecurityUtil.currentUserId())
                .createdAt(Instant.now())
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        eventPublisher
                .publishEvent(new AppointmentBookedEvent(saved.getId().toHexString(), saved.getAppointmentCode()));

        return mapToResponse(saved);
    }

    @Override
    public AppointmentResponse getAppointmentById(String appointmentId) {
        Appointment appointment = appointmentRepository.findById(new ObjectId(appointmentId))
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        ObjectId currentUserId = SecurityUtil.currentUserId();

        if (SecurityUtil.hasRole("ADMIN"))
            return mapToResponse(appointment);

        if (SecurityUtil.hasRole("DOCTOR") && appointment.getDoctorId().equals(currentUserId))
            return mapToResponse(appointment);

        if (SecurityUtil.hasRole("PATIENT") && appointment.getPatientId().equals(currentUserId))
            return mapToResponse(appointment);

        throw new RuntimeException("Access Denied");
    }

    @Override
    public List<AppointmentResponse> getMyAppointments() {

        ObjectId currentUserId = SecurityUtil.currentUserId();
        List<Appointment> appointments;

        if (SecurityUtil.hasRole("DOCTOR"))
            appointments = appointmentRepository.findByDoctorIdAndStatus(currentUserId, AppointmentStatus.SCHEDULED);
        else if (SecurityUtil.hasRole("PATIENT"))
            appointments = appointmentRepository.findByPatientIdAndStatus(currentUserId, AppointmentStatus.SCHEDULED);
        else
            throw new RuntimeException("Access Denied");

        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelAppointment(String appointmentId) {

        Appointment appointment = appointmentRepository.findById(new ObjectId(appointmentId))
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        ObjectId currentUserId = SecurityUtil.currentUserId();

        if (SecurityUtil.hasRole("ADMIN") || SecurityUtil.hasRole("RECEPTIONIST")) {
            appointment.setStatus(AppointmentStatus.CANCELED);
            appointmentRepository.save(appointment);
            return;
        }

        if (SecurityUtil.hasRole("DOCTOR") && appointment.getDoctorId().equals(currentUserId)) {
            appointment.setStatus(AppointmentStatus.CANCELED);
            appointmentRepository.save(appointment);
            return;
        }

        throw new RuntimeException("Access Denied");

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
