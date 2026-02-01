package com.nilanjan.backend.billing.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.billing.api.dto.BillSearchFilter;
import com.nilanjan.backend.billing.api.dto.BillingResponse;
import com.nilanjan.backend.billing.api.dto.CreateBillRequest;
import com.nilanjan.backend.billing.api.dto.PaymentRequest;
import com.nilanjan.backend.billing.application.BillingService;
import com.nilanjan.backend.common.dto.PageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    @PostMapping
    public ResponseEntity<BillingResponse> create(@RequestBody CreateBillRequest request) {
        return ResponseEntity.ok(billingService.createBill(request));
    }

    @PostMapping("/{billId}/payments")
    public ResponseEntity<BillingResponse> payment(@PathVariable String billId, @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(billingService.recordPayment(billId, request));
    }

    @PostMapping("/{billId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable String billId) {
        billingService.cancelBill(billId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{billId}/details")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<BillingResponse> getDetails(@PathVariable String billId) {
        return ResponseEntity.ok(billingService.getBillDetails(billId));
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<PageResponse<BillingResponse>> search(
            @RequestBody BillSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(billingService.advancedSearch(filter, page, size));
    }
}
