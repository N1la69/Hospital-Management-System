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
import com.nilanjan.backend.pharmacy.api.dto.AddMedicineRequest;
import com.nilanjan.backend.pharmacy.api.dto.AddStockRequest;
import com.nilanjan.backend.pharmacy.api.dto.MedicineResponse;
import com.nilanjan.backend.pharmacy.api.dto.UpdateMedicineRequest;
import com.nilanjan.backend.pharmacy.domain.InventoryBatch;
import com.nilanjan.backend.pharmacy.domain.Medicine;
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
    public void addStock(AddStockRequest request) {

        InventoryBatch batch = InventoryBatch.builder()
                .medicineId(new ObjectId(request.medicineId()))
                .batchNo(BatchNumberGenerator.generate())
                .mfgDate(request.mfgDate())
                .expiryDate(request.expiryDate())
                .quantityAvailable(request.quantity())
                .costPrice(request.costPrice())
                .sellingPrice(request.sellingPrice())
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
    }

    @Override
    public MedicineResponse createMedicine(AddMedicineRequest request) {

        Medicine medicine = Medicine.builder()
                .name(request.name())
                .manufacturer(request.manufacturer())
                .category(request.category())
                .unit(request.unit())
                .defaultPrice(request.defaultPrice())
                .cgstPercent(request.cgstPercent())
                .sgstPercent(request.sgstPercent())
                .sellingPrice(request.sellingPrice())
                .reorderLevel(request.reorderLevel())
                .active(true)
                .build();

        Medicine saved = medicineRepository.save(medicine);

        return mapToResponse(saved);
    }

    @Override
    public MedicineResponse updateMedicine(String medicineId, UpdateMedicineRequest request) {

        Medicine medicine = medicineRepository.findById(new ObjectId(medicineId))
                .orElseThrow(() -> new RuntimeException("Medicine not found: " + medicineId));

        medicine.setName(request.name());
        medicine.setManufacturer(request.manufacturer());
        medicine.setCategory(request.category());
        medicine.setUnit(request.unit());
        medicine.setDefaultPrice(request.defaultPrice());
        medicine.setCgstPercent(request.cgstPercent());
        medicine.setSgstPercent(request.sgstPercent());
        medicine.setSellingPrice(request.sellingPrice());
        medicine.setReorderLevel(request.reorderLevel());
        medicine.setActive(request.active());

        Medicine saved = medicineRepository.save(medicine);

        return mapToResponse(saved);
    }

    @Override
    public MedicineResponse getMedicineById(String medicineId) {

        Medicine medicine = medicineRepository.findById(new ObjectId(medicineId))
                .orElseThrow(() -> new RuntimeException("Medicine not found: " + medicineId));

        return mapToResponse(medicine);
    }

    @Override
    public void dispenseByBill(String billId) {

        Bill bill = billRepository.findById(new ObjectId(billId))
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));

        for (BillItem item : bill.getItems()) {
            if (!item.getType().name().equals("MEDICINE"))
                continue;

            Medicine medicine = medicineRepository
                    .findByNameContainingIgnoreCase(item.getDescription())
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

            if (qty <= med.getReorderLevel()) {
                alerts.add(med.getName() + " low stock: " + qty);
            }
        });

        return alerts;
    }

    // HELPERS
    private MedicineResponse mapToResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId().toHexString(),
                medicine.getName(),
                medicine.getManufacturer(),
                medicine.getCategory(),
                medicine.getUnit(),
                medicine.getDefaultPrice(),
                medicine.getCgstPercent(),
                medicine.getSgstPercent(),
                medicine.getSellingPrice(),
                medicine.getReorderLevel(),
                medicine.isActive());
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
