package com.nilanjan.backend.pharmacy.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.pharmacy.api.dto.AddMedicineRequest;
import com.nilanjan.backend.pharmacy.api.dto.AddStockRequest;
import com.nilanjan.backend.pharmacy.api.dto.InventoryResponse;
import com.nilanjan.backend.pharmacy.api.dto.MedicineResponse;
import com.nilanjan.backend.pharmacy.api.dto.MedicineSearchFilter;
import com.nilanjan.backend.pharmacy.api.dto.MedicineStockResponse;
import com.nilanjan.backend.pharmacy.api.dto.UpdateMedicineRequest;

public interface PharmacyService {

    InventoryResponse addStock(AddStockRequest request);

    MedicineResponse createMedicine(AddMedicineRequest request);

    MedicineResponse updateMedicine(String medicineId, UpdateMedicineRequest request);

    MedicineStockResponse getMedicineById(String medicineId);

    void dispenseByBill(String billId);

    List<String> checkExpiryAlerts();

    List<String> checkLowStockAlerts();

    PageResponse<MedicineStockResponse> advancedSearch(MedicineSearchFilter filter, int page, int size);
}
