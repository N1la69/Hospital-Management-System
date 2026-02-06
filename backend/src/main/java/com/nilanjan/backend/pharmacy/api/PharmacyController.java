package com.nilanjan.backend.pharmacy.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.pharmacy.api.dto.AddMedicineRequest;
import com.nilanjan.backend.pharmacy.api.dto.AddStockRequest;
import com.nilanjan.backend.pharmacy.api.dto.MedicineResponse;
import com.nilanjan.backend.pharmacy.api.dto.MedicineSearchFilter;
import com.nilanjan.backend.pharmacy.api.dto.UpdateMedicineRequest;
import com.nilanjan.backend.pharmacy.application.PharmacyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pharmacy")
public class PharmacyController {

    private final PharmacyService pharmacyService;

    // =============== MEDICINE ===============

    @PostMapping("/medicines")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<MedicineResponse> createMed(@RequestBody AddMedicineRequest request) {
        return ResponseEntity.ok(pharmacyService.createMedicine(request));
    }

    @PutMapping("/medicines/{medicineId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<MedicineResponse> updateMed(@PathVariable String medicineId,
            @RequestBody UpdateMedicineRequest request) {
        return ResponseEntity.ok(pharmacyService.updateMedicine(medicineId, request));
    }

    @GetMapping("/medicines/{medicineId}")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<MedicineResponse> getMedById(@PathVariable String medicineId) {
        return ResponseEntity.ok(pharmacyService.getMedicineById(medicineId));
    }

    @PostMapping("/medicines/search")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<PageResponse<MedicineResponse>> searchMedicines(
            @RequestBody MedicineSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(pharmacyService.advancedSearch(filter, page, size));
    }

    // =============== STOCK MANAGEMENT ===============

    @PostMapping("/stock")
    @PreAuthorize("hasAnyRole('ADMIN','PHARMACIST')")
    public ResponseEntity<Void> addStock(@RequestBody AddStockRequest request) {
        pharmacyService.addStock(request);
        return ResponseEntity.noContent().build();
    }

    // =============== DISPENSE FROM BILL ===============

    @PostMapping("/dispense/{billId}")
    @PreAuthorize("hasRole('PHARMACIST')")
    public ResponseEntity<Void> dispenseByBill(@PathVariable String billId) {
        pharmacyService.dispenseByBill(billId);
        return ResponseEntity.noContent().build();
    }

    // =============== ALERTS ===============

    @GetMapping("/alerts/expiry")
    public ResponseEntity<List<String>> expiryAlerts() {
        return ResponseEntity.ok(pharmacyService.checkExpiryAlerts());
    }

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<String>> lowStockAlerts() {
        return ResponseEntity.ok(pharmacyService.checkLowStockAlerts());
    }

}
