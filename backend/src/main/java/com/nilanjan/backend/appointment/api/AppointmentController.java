package com.nilanjan.backend.appointment.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.appointment.api.dto.AppointmentResponse;
import com.nilanjan.backend.appointment.api.dto.AppointmentSearchFilter;
import com.nilanjan.backend.appointment.api.dto.CancelAppointmentRequest;
import com.nilanjan.backend.appointment.api.dto.CreateAppointmentRequest;
import com.nilanjan.backend.appointment.application.AppointmentService;
import com.nilanjan.backend.appointment.domain.AppointmentStatus;
import com.nilanjan.backend.common.dto.PageResponse;

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

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Void> checkIn(@PathVariable String id) {
        appointmentService.updateStatus(id, AppointmentStatus.CHECKED_IN, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Void> complete(@PathVariable String id) {
        appointmentService.updateStatus(id, AppointmentStatus.COMPLETED, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/no-show")
    @PreAuthorize("hasRole('RECEPTIONIST')")
    public ResponseEntity<Void> noShow(@PathVariable String id) {
        appointmentService.updateStatus(id, AppointmentStatus.NO_SHOW, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<Void> cancel(@PathVariable String id, @RequestBody CancelAppointmentRequest request) {
        appointmentService.cancelAppointment(id, request.reason());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<AppointmentResponse>> getAppointments() {
        return ResponseEntity.ok(appointmentService.getAppointments());
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
    public ResponseEntity<Map<String, List<AppointmentResponse>>> myAppointments() {
        return ResponseEntity.ok(appointmentService.getMyAppointments());
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    public ResponseEntity<PageResponse<AppointmentResponse>> search(
            @RequestBody AppointmentSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(appointmentService.advancedSearch(filter, page, size));
    }

}
