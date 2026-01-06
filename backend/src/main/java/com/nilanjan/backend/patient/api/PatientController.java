package com.nilanjan.backend.patient.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.patient.api.dto.CreatePatientRequest;
import com.nilanjan.backend.patient.api.dto.PatientResponse;
import com.nilanjan.backend.patient.api.dto.PatientSelfRegisterRequest;
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

    @PostMapping("/patient-registration")
    public ResponseEntity<PatientResponse> selfRegister(@RequestBody PatientSelfRegisterRequest request) {
        return ResponseEntity.ok(patientService.selfRegister(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    public ResponseEntity<List<PatientResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone) {
        return ResponseEntity.ok(patientService.searchPatients(name, phone));
    }

    @PostMapping("/{patientId}/assign-doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<Void> assignDoctor(
            @PathVariable String patientId,
            @PathVariable String doctorId) {
        patientService.assignDoctor(patientId, doctorId);
        return ResponseEntity.ok().build();
    }
}
