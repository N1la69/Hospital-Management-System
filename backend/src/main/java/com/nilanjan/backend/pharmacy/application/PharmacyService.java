package com.nilanjan.backend.pharmacy.application;

import java.util.List;

import com.nilanjan.backend.pharmacy.api.dto.AddStockRequest;

public interface PharmacyService {

    void addStock(AddStockRequest request);

    void dispenseByBill(String billId);

    List<String> checkExpiryAlerts();

    List<String> checkLowStockAlerts();
}
