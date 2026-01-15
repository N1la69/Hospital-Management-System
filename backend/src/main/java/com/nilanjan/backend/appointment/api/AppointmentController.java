package com.nilanjan.backend.appointment.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.CancelAppointmentRequest;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;
import com.nilanjan.backend.appointment.application.AppointmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<AppointmentResponse> book(@RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentResponse>> getAppointments() {
        return ResponseEntity.ok(appointmentService.getAppointments());
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
    public ResponseEntity<List<AppointmentResponse>> myAppointments() {
        return ResponseEntity.ok(appointmentService.getMyAppointments());
    }

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Void> checkIn(@PathVariable String id) {
        appointmentService.checkInAppointment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<Void> start(@PathVariable String id) {
        appointmentService.startAppointment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<Void> complete(@PathVariable String id) {
        appointmentService.completeAppointment(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<Void> cancel(@PathVariable String id, @RequestBody CancelAppointmentRequest request) {
        appointmentService.cancelAppointment(id, request.reason());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/no-show")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<Void> noShow(@PathVariable String id) {
        appointmentService.markNoShow(id);
        return ResponseEntity.ok().build();
    }
}
