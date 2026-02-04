package com.nilanjan.backend.pharmacist.api;

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
import com.nilanjan.backend.pharmacist.api.dto.CreatePharmacistRequest;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistResponse;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistSearchFilter;
import com.nilanjan.backend.pharmacist.api.dto.UpdatePharmacistRequest;
import com.nilanjan.backend.pharmacist.application.PharmacistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pharmacists")
@RequiredArgsConstructor
public class PharmacistController {

    private final PharmacistService pharmacistService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PharmacistResponse> create(@RequestBody CreatePharmacistRequest request) {
        return ResponseEntity.ok(pharmacistService.createPharmacist(request));
    }

    @PutMapping("/{pharmacistId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PharmacistResponse> update(@PathVariable String pharmacistId,
            @RequestBody UpdatePharmacistRequest request) {
        return ResponseEntity.ok(pharmacistService.updatePharmacist(pharmacistId, request));
    }

    @DeleteMapping("/{pharmacistId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String pharmacistId) {
        pharmacistService.deletePharmacist(pharmacistId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{pharmacistId}/details")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PharmacistResponse> getDetails(@PathVariable String pharmacistId) {
        return ResponseEntity.ok(pharmacistService.getPharmacistDetails(pharmacistId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PharmacistResponse>> getAllPharmacists() {
        return ResponseEntity.ok(pharmacistService.getAllPharmacists());
    }

    @PostMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<PharmacistResponse>> advancedSearch(
            @RequestBody PharmacistSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(pharmacistService.advancedSearch(filter, page, size));
    }
}
