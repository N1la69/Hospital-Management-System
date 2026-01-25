package com.nilanjan.backend.patient.medical.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.patient.medical.api.dto.CreateMedicalRecordRequest;
import com.nilanjan.backend.patient.medical.api.dto.MedicalRecordResponse;
import com.nilanjan.backend.patient.medical.api.dto.UpdateMedicalRecordRequest;
import com.nilanjan.backend.patient.medical.application.MedicalRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<MedicalRecordResponse> create(@RequestBody CreateMedicalRecordRequest request) {
        return ResponseEntity.ok(medicalRecordService.create(request));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<MedicalRecordResponse> update(@RequestBody UpdateMedicalRecordRequest request) {
        return ResponseEntity.ok(medicalRecordService.update(request));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PATIENT')")
    public ResponseEntity<List<MedicalRecordResponse>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(medicalRecordService.getByPatientId(patientId));
    }

}
