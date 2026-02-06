package com.nilanjan.backend.pharmacy.application;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.billing.domain.Bill;
import com.nilanjan.backend.billing.domain.BillItem;
import com.nilanjan.backend.billing.repository.BillRepository;
import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.pharmacy.api.dto.AddMedicineRequest;
import com.nilanjan.backend.pharmacy.api.dto.AddStockRequest;
import com.nilanjan.backend.pharmacy.api.dto.InventoryResponse;
import com.nilanjan.backend.pharmacy.api.dto.MedicineResponse;
import com.nilanjan.backend.pharmacy.api.dto.MedicineSearchFilter;
import com.nilanjan.backend.pharmacy.api.dto.MedicineStockResponse;
import com.nilanjan.backend.pharmacy.api.dto.UpdateMedicineRequest;
import com.nilanjan.backend.pharmacy.domain.InventoryBatch;
import com.nilanjan.backend.pharmacy.domain.Medicine;
import com.nilanjan.backend.pharmacy.domain.MedicineStatus;
import com.nilanjan.backend.pharmacy.domain.StockTransaction;
import com.nilanjan.backend.pharmacy.domain.StockTransactionType;
import com.nilanjan.backend.pharmacy.repository.InventoryBatchRepository;
import com.nilanjan.backend.pharmacy.repository.MedicineRepository;
import com.nilanjan.backend.pharmacy.repository.StockTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final MedicineRepository medicineRepository;
    private final InventoryBatchRepository batchRepository;
    private final StockTransactionRepository transactionRepository;
    private final BillRepository billRepository;

    @Override
    public InventoryResponse addStock(AddStockRequest request) {

        InventoryBatch batch = InventoryBatch.builder()
                .medicineId(new ObjectId(request.medicineId()))
                .batchNo(BatchNumberGenerator.generate())
                .mfgDate(request.mfgDate())
                .expiryDate(request.expiryDate())
                .quantityAvailable(request.quantity())
                .costPrice(request.costPrice())
                .supplier(request.supplier())
                .build();

        InventoryBatch saved = batchRepository.save(batch);

        StockTransaction txn = StockTransaction.builder()
                .medicineId(saved.getMedicineId())
                .batchId(saved.getId())
                .type(StockTransactionType.IN)
                .quantity(request.quantity())
                .timestamp(Instant.now())
                .remark("Stock Purchase")
                .build();

        transactionRepository.save(txn);

        return mapToInventoryResponse(saved);
    }

    @Override
    public MedicineResponse createMedicine(AddMedicineRequest request) {

        Medicine medicine = Medicine.builder()
                .medicineCode(MedicineCodeGenerator.generate())
                .medicineName(request.medicineName())
                .manufacturerName(request.manufacturerName())
                .category(request.category())
                .sellingPrice(request.sellingPrice())
                .status(MedicineStatus.ACTIVE)
                .reorderLevel(request.reorderLevel())
                .build();

        Medicine saved = medicineRepository.save(medicine);

        return mapToMedResponse(saved);
    }

    @Override
    public MedicineResponse updateMedicine(String medicineId, UpdateMedicineRequest request) {

        Medicine medicine = medicineRepository.findById(new ObjectId(medicineId))
                .orElseThrow(() -> new RuntimeException("Medicine not found: " + medicineId));

        medicine.setMedicineName(request.medicineName());
        medicine.setManufacturerName(request.manufacturerName());
        medicine.setCategory(request.category());
        medicine.setSellingPrice(request.sellingPrice());
        medicine.setReorderLevel(request.reorderLevel());
        medicine.setStatus(request.status());

        Medicine saved = medicineRepository.save(medicine);

        return mapToMedResponse(saved);
    }

    @Override
    public MedicineStockResponse getMedicineById(String medicineId) {

        Medicine medicine = medicineRepository.findById(new ObjectId(medicineId))
                .orElseThrow(() -> new RuntimeException("Medicine not found: " + medicineId));

        MedicineResponse medResponse = mapToMedResponse(medicine);

        InventoryBatch batch = batchRepository.findByMedicineId(new ObjectId(medicineId))
                .orElseThrow(() -> new RuntimeException("No batch founf for Medicine: " + medicineId));

        InventoryResponse inventoryResponse = mapToInventoryResponse(batch);

        return new MedicineStockResponse(medResponse, inventoryResponse);
    }

    @Override
    public void dispenseByBill(String billId) {

        Bill bill = billRepository.findById(new ObjectId(billId))
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        for (BillItem item : bill.getItems()) {
            if (!item.getType().name().equals("MEDICINE"))
                continue;

            Medicine medicine = medicineRepository
                    .findByMedicineNameContainingIgnoreCase(item.getDescription())
                    .stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            deductFIFO(medicine.getId(), item.getQuantity(), bill.getId());
        }
    }

    @Override
    public List<String> checkExpiryAlerts() {

        Instant limit = Instant.now().plusSeconds(30L * 24 * 60 * 60);

        return batchRepository.findAll().stream()
                .filter(b -> b.getExpiryDate().isBefore(limit))
                .map(b -> "Batch " + b.getBatchNo() + " expiring soon")
                .toList();
    }

    @Override
    public List<String> checkLowStockAlerts() {

        List<String> alerts = new ArrayList<>();

        medicineRepository.findAll().forEach(med -> {

            int qty = batchRepository.findByMedicineIdAndQuantityAvailableGreaterThan(med.getId(), 0)
                    .stream()
                    .mapToInt(InventoryBatch::getQuantityAvailable)
                    .sum();

            if (med.getStatus() == MedicineStatus.ACTIVE && qty <= med.getReorderLevel())
                alerts.add(med.getMedicineName() + " low stock: " + qty);

        });

        return alerts;
    }

    @Override
    public PageResponse<MedicineResponse> advancedSearch(MedicineSearchFilter filter, int page, int size) {

        PageResult<Medicine> result = medicineRepository.search(filter, page, size);
        List<MedicineResponse> items = result.data().stream()
                .map(this::mapToMedResponse)
                .toList();

        return new PageResponse<>(items, result.total(), page, size);
    }

    // HELPERS
    private MedicineResponse mapToMedResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId().toHexString(),
                medicine.getMedicineName(),
                medicine.getMedicineCode(),
                medicine.getManufacturerName(),
                medicine.getCategory(),
                medicine.getSellingPrice(),
                medicine.getReorderLevel(),
                medicine.getStatus());
    }

    private InventoryResponse mapToInventoryResponse(InventoryBatch batch) {
        return new InventoryResponse(
                batch.getMedicineId().toHexString(),
                batch.getBatchNo(),
                batch.getMfgDate(),
                batch.getExpiryDate(),
                batch.getQuantityAvailable(),
                batch.getSupplier());
    }

    private void deductFIFO(ObjectId medicineId, int qtyNeeded, ObjectId billId) {
        List<InventoryBatch> batches = batchRepository.findByMedicineIdAndQuantityAvailableGreaterThan(medicineId, 0)
                .stream()
                .sorted(Comparator.comparing(InventoryBatch::getExpiryDate))
                .toList();

        int remaining = qtyNeeded;

        for (InventoryBatch batch : batches) {
            if (remaining <= 0)
                break;

            int available = batch.getQuantityAvailable();
            int deduct = Math.min(available, remaining);

            batch.setQuantityAvailable(available - deduct);
            batchRepository.save(batch);

            StockTransaction txn = StockTransaction.builder()
                    .medicineId(medicineId)
                    .batchId(batch.getId())
                    .billId(billId)
                    .type(StockTransactionType.OUT)
                    .quantity(deduct)
                    .timestamp(Instant.now())
                    .remark("Dispense via Bill")
                    .build();

            transactionRepository.save(txn);

            remaining -= deduct;
        }

        if (remaining > 0) {
            throw new RuntimeException("Insufficient stock");
        }
    }

}
