package com.nilanjan.backend.receptionist.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.receptionist.api.dto.CreateReceptionistRequest;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistResponse;
import com.nilanjan.backend.receptionist.application.ReceptionistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/receptionists")
@RequiredArgsConstructor
public class ReceptionistController {

    private final ReceptionistService receptionistService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReceptionistResponse> create(@RequestBody CreateReceptionistRequest request) {
        ReceptionistResponse response = receptionistService.createReceptionist(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReceptionistResponse>> getAllReceptionists() {
        return ResponseEntity.ok(receptionistService.getAllReceptionists());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReceptionistResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(receptionistService.getReceptionistById(id));
    }
}
