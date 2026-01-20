package com.nilanjan.backend.patient.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.SimpleOption;
import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.api.dto.UpdatePatientRequest;
import com.nilanjan.backend.patient.application.PatientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<PatientResponse> create(@RequestBody CreatePatientRequest request) {
        return ResponseEntity.ok(patientService.createPatient(request));
    }

    @PutMapping("/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<PatientResponse> update(@PathVariable String patientId,
            @RequestBody UpdatePatientRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, request));
    }

    @DeleteMapping("/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<Void> delete(@PathVariable String patientId) {
        patientService.deletePatient(patientId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    public ResponseEntity<PageResponse<PatientResponse>> advancedSearch(
            @RequestBody PatientSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(patientService.advancedSearch(filter, page, size));
    }

    @GetMapping("/options")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<SimpleOption>> patientOptions() {
        return ResponseEntity.ok(patientService.patientOptions());
    }

}
