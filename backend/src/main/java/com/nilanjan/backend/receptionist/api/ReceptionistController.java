package com.nilanjan.backend.receptionist.api;

import java.util.List;

import org.springframework.http.HttpStatus;
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
import com.nilanjan.backend.receptionist.api.dto.CreateReceptionistRequest;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistResponse;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistSearchFilter;
import com.nilanjan.backend.receptionist.api.dto.UpdateReceptionistRequest;
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

    @PutMapping("/{receptionistId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReceptionistResponse> update(@PathVariable String receptionistId,
            @RequestBody UpdateReceptionistRequest request) {
        return ResponseEntity.ok(receptionistService.updateReceptionist(receptionistId, request));
    }

    @DeleteMapping("/{receptionistId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String receptionistId) {
        receptionistService.deleteReceptionist(receptionistId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReceptionistResponse>> getAllReceptionists() {
        return ResponseEntity.ok(receptionistService.getAllReceptionists());
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<ReceptionistResponse>> advancedSearch(
            @RequestBody ReceptionistSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(receptionistService.advancedSearch(filter, page, size));
    }
}
