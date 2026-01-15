package com.nilanjan.backend.doctor.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.SimpleOption;
import com.nilanjan.backend.doctor.api.dto.CreateDoctorRequest;
import com.nilanjan.backend.doctor.api.dto.DoctorResponse;
import com.nilanjan.backend.doctor.api.dto.DoctorSearchFilter;
import com.nilanjan.backend.doctor.application.DoctorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorResponse> create(@RequestBody CreateDoctorRequest request) {
        return ResponseEntity.ok(doctorService.createDoctor(request));
    }

    @GetMapping("/me")
    public ResponseEntity<DoctorResponse> getMyProfile() {
        return ResponseEntity.ok(doctorService.getMyDoctorProfile());
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    public ResponseEntity<PageResponse<DoctorResponse>> advancedSearch(
            @RequestBody DoctorSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(doctorService.advancedSearch(filter, page, size));
    }

    @GetMapping("/options")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<SimpleOption>> doctorOptions() {
        return ResponseEntity.ok(doctorService.doctorOptions());
    }

}
