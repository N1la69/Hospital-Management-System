package com.nilanjan.backend.appointment.application;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.AppointmentSearchFilter;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;
import com.nilanjan.backend.appointment.api.dto.DoctorPatientRowResponse;
import com.nilanjan.backend.appointment.api.dto.DoctorPatientSearchFilter;
import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;
import com.nilanjan.backend.appointment.repository.AppointmentRepository;
import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.doctor.availability.domain.DoctorAvailability;
import com.nilanjan.backend.doctor.availability.repository.DoctorAvailabilityRepository;
import com.nilanjan.backend.doctor.domain.Doctor;
import com.nilanjan.backend.doctor.repository.DoctorRepository;
import com.nilanjan.backend.patient.domain.Patient;
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
    public PageResponse<AppointmentResponse> advancedSearch(AppointmentSearchFilter filter, int page, int size) {

        Set<ObjectId> patientIds = null;
        Set<ObjectId> doctorIds = null;

        if (filter.patientName() != null && !filter.patientName().isBlank()) {
            patientIds = patientRepository.searchByName(filter.patientName())
                    .stream().map(Patient::getId).collect(Collectors.toSet());

            if (patientIds.isEmpty())
                return new PageResponse<>(List.of(), 0, page, size);
        }

        if (filter.doctorName() != null && !filter.doctorName().isBlank()) {
            doctorIds = doctorRepository.searchByName(filter.doctorName())
                    .stream().map(Doctor::getId).collect(Collectors.toSet());

            if (doctorIds.isEmpty())
                return new PageResponse<>(List.of(), 0, page, size);
        }

        PageResult<Appointment> result = appointmentRepository.search(filter, page, size, patientIds, doctorIds);

        List<Appointment> data = result.data();

        if (filter.day() != null) {
            System.out.println("Applying DayOfWeek filter = " + filter.day());

            data = data.stream()
                    .filter(a -> {
                        DayOfWeek d = a.getScheduledStart().atZone(ZoneOffset.UTC).getDayOfWeek();

                        System.out.println("Appointment " + a.getAppointmentCode()
                                + " -> UTC Day = " + d);

                        return d.equals(filter.day());
                    }).toList();
        }

        long total = data.size();
        int from = Math.min(page * size, data.size());
        int to = Math.min(from + size, data.size());

        List<Appointment> pageData = data.subList(from, to);

        List<AppointmentResponse> items = pageData.stream().map(this::mapToResponse).toList();

        return new PageResponse<>(items, total, page, size);
    }

    @Override
    public PageResponse<DoctorPatientRowResponse> getMyPatients(
            DoctorPatientSearchFilter filter, int page, int size) {

        if (!SecurityUtil.hasRole("DOCTOR"))
            throw new SecurityException("Access Denied");

        ObjectId userId = SecurityUtil.currentUserId();

        Doctor doctor = doctorRepository.findByLinkedUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        String search = filter.searchText();

        boolean searchByAppointmentCode = looksLikeAppointmentCode(search);

        // Build appointment filter
        AppointmentSearchFilter appointmentSearchFilter = new AppointmentSearchFilter(
                searchByAppointmentCode ? search : null, // appointmentCode
                null, // patientName (unused by repo)
                null,
                null,
                filter.fromDate(),
                filter.toDate(),
                null,
                null);

        // Build patientIds only if NOT appointment search
        final Set<ObjectId> patientIds;

        if (!searchByAppointmentCode && search != null && !search.isBlank()) {

            patientIds = new HashSet<>();

            patientIds.addAll(
                    patientRepository.searchByName(search)
                            .stream()
                            .map(Patient::getId)
                            .toList());

            patientRepository.findByPatientCodeRegex(search)
                    .forEach(p -> patientIds.add(p.getId()));

            if (patientIds.isEmpty()) {
                return new PageResponse<>(List.of(), 0, page, size);
            }
        } else {
            patientIds = null;
        }

        Set<ObjectId> doctorIds = Set.of(doctor.getId());

        PageResult<Appointment> result = appointmentRepository.search(
                appointmentSearchFilter,
                page,
                size,
                patientIds,
                doctorIds);

        List<DoctorPatientRowResponse> rows = result.data().stream().map(a -> {
            Patient p = patientRepository.findById(a.getPatientId()).orElseThrow();

            return new DoctorPatientRowResponse(
                    p.getId().toHexString(),
                    p.getPatientCode(),
                    a.getAppointmentCode(),
                    p.getFirstName() + " " + p.getLastName(),
                    a.getScheduledStart());
        }).toList();

        return new PageResponse<>(rows, result.total(), page, size);
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

    private boolean looksLikeAppointmentCode(String s) {
        return s != null && s.toUpperCase().startsWith("APT-");
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {

        String patientName = patientRepository.findById(appointment.getPatientId())
                .map(p -> p.getFirstName() + " " + p.getLastName())
                .orElse("Unknown Patient");

        String doctorName = doctorRepository.findById(appointment.getDoctorId())
                .map(d -> d.getFirstName() + " " + d.getLastName())
                .orElse("Unknown Doctor");

        return new AppointmentResponse(
                appointment.getId().toHexString(),
                appointment.getAppointmentCode(),
                appointment.getPatientId().toHexString(),
                patientName,
                appointment.getDoctorId().toHexString(),
                doctorName,
                appointment.getScheduledStart(),
                appointment.getScheduledEnd(),
                appointment.getStatus());
    }

    private Appointment getAppointment(String id) {
        return appointmentRepository.findById(new ObjectId(id))
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
    }

}
