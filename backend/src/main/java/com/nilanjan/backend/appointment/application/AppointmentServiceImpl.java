package com.nilanjan.backend.appointment.application;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneOffset;
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
import com.nilanjan.backend.doctor.domain.Doctor;
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

        DayOfWeek day = startInstant.atZone(ZoneOffset.UTC).getDayOfWeek();

        if (startInstant.isAfter(endInstant) || startInstant.equals(endInstant))
            throw new RuntimeException("Invalid Appointment Window");

        ObjectId patientId = new ObjectId(request.patientId());
        ObjectId doctorId = new ObjectId(request.doctorId());

        List<DoctorAvailability> availabilities = doctorAvailabilityRepository.findByDoctorIdAndDayOfWeek(doctorId,
                day);

        System.out.println("Found availabilities = " + availabilities.size());

        if (availabilities.isEmpty())
            throw new RuntimeException("Doctor is not available on this day: " + day);

        boolean insideAvailability = false;

        for (DoctorAvailability a : availabilities) {

            LocalTime availStart = a.getStartTime().atZone(ZoneOffset.UTC).toLocalTime();
            LocalTime availEnd = a.getEndTime().atZone(ZoneOffset.UTC).toLocalTime();

            LocalTime reqStart = startInstant.atZone(ZoneOffset.UTC).toLocalTime();
            LocalTime reqEnd = endInstant.atZone(ZoneOffset.UTC).toLocalTime();

            boolean withinTimeWindow = !reqStart.isBefore(availStart) &&
                    !reqEnd.isAfter(availEnd);

            long appointmentMinutes = Duration.between(reqStart, reqEnd).toMinutes();

            boolean validSlotMultiple = appointmentMinutes > 0 &&
                    appointmentMinutes % a.getSlotMinutes() == 0;

            if (withinTimeWindow && validSlotMultiple) {
                insideAvailability = true;
                break;
            }
        }

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
    public List<AppointmentResponse> getMyAppointments() {

        ObjectId currentUserId = SecurityUtil.currentUserId();
        List<Appointment> appointments;

        if (SecurityUtil.hasRole("DOCTOR")) {
            Doctor doctor = doctorRepository.findByLinkedUserId(currentUserId)
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
            appointments = appointmentRepository.findByDoctorIdAndStatus(doctor.getId(), AppointmentStatus.SCHEDULED);
        } else if (SecurityUtil.hasRole("PATIENT"))
            appointments = appointmentRepository.findByPatientIdAndStatus(currentUserId, AppointmentStatus.SCHEDULED);
        else
            throw new RuntimeException("Access Denied");

        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointments() {

        List<Appointment> appointments = appointmentRepository.findAll();

        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelAppointment(String appointmentId, String reason) {

        Appointment appointment = getAppointment(appointmentId);
        AppointmentStatus status = appointment.getStatus();

        if (SecurityUtil.hasRole("ADMIN")) {
            // ADMIN CANCELS ANYTIME
        } else if (SecurityUtil.hasRole("RECEPTIONIST") && status == AppointmentStatus.SCHEDULED) {
            // RECEPTIONIST ALLOWED TO CANCEL AFTER APPOINTMENT IS SCHEDULED
        } else {
            throw new SecurityException("Access Denied: Not permitted to cancel appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        appointment.setCancelledAt(Instant.now());
        appointment.setCancelledReason(reason);
        appointment.setCancelledByRole(SecurityUtil.currentUserId().toHexString());

        appointmentRepository.save(appointment);
    }

    @Override
    public void checkInAppointment(String appointmentId) {

        Appointment appointment = getAppointment(appointmentId);

        if (appointment.getStatus() != AppointmentStatus.SCHEDULED)
            throw new IllegalStateException("Cannot check-in from status: " + appointment.getStatus());

        if (!SecurityUtil.hasRole("RECEPTIONIST") && !SecurityUtil.hasRole("ADMIN"))
            throw new SecurityException("Only receptionist or admin can check-in");

        appointment.setStatus(AppointmentStatus.CHECKED_IN);
        appointment.setCheckedInAt(Instant.now());

        appointmentRepository.save(appointment);
    }

    @Override
    public void startAppointment(String appointmentId) {

        Appointment appointment = getAppointment(appointmentId);

        if (appointment.getStatus() != AppointmentStatus.CHECKED_IN)
            throw new IllegalStateException("Cannot start appointment from status: " + appointment.getStatus());

        if (!SecurityUtil.hasRole("RECEPTIONIST") && !SecurityUtil.hasRole("ADMIN"))
            throw new SecurityException("Only receptionist or admin can start the appointment");

        appointment.setStatus(AppointmentStatus.IN_PROGRESS);
        appointment.setStartedAt(Instant.now());

        appointmentRepository.save(appointment);
    }

    @Override
    public void completeAppointment(String appointmentId) {

        Appointment appointment = getAppointment(appointmentId);

        if (appointment.getStatus() != AppointmentStatus.IN_PROGRESS)
            throw new IllegalStateException("Cannot end appointment from status: " + appointment.getStatus());

        if (!SecurityUtil.hasRole("RECEPTIONIST") && !SecurityUtil.hasRole("ADMIN"))
            throw new SecurityException("Only receptionist or admin can end the appointment");

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setCompletedAt(Instant.now());

        appointmentRepository.save(appointment);
    }

    @Override
    public void markNoShow(String appointmentId) {

        Appointment appointment = getAppointment(appointmentId);

        if (appointment.getStatus() != AppointmentStatus.SCHEDULED)
            throw new IllegalStateException("Cannot mark no-show from status: " + appointment.getStatus());

        if (!SecurityUtil.hasRole("RECEPTIONIST") && !SecurityUtil.hasRole("ADMIN"))
            throw new SecurityException("Only receptionist or admin can mark no-show");

        appointment.setStatus(AppointmentStatus.NO_SHOW);

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

    private Appointment getAppointment(String id) {
        return appointmentRepository.findById(new ObjectId(id))
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
    }

}
