package com.nilanjan.backend.doctor.availability.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.doctor.availability.api.dto.CreateAvailabilityRequest;
import com.nilanjan.backend.doctor.availability.api.dto.DoctorAvailabilityResponse;
import com.nilanjan.backend.doctor.availability.application.DoctorAvailabilityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors/availability")
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService doctorAvailabilityService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorAvailabilityResponse> add(@RequestBody CreateAvailabilityRequest request) {
        return ResponseEntity.ok(doctorAvailabilityService.addAvailability(request));
    }

    @GetMapping("/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<List<DoctorAvailabilityResponse>> get(@PathVariable String doctorId) {
        return ResponseEntity.ok(doctorAvailabilityService.getAvailability(doctorId));
    }
}
