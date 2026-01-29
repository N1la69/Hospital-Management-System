package com.nilanjan.backend.billing.application;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.appointment.repository.AppointmentRepository;
import com.nilanjan.backend.billing.api.dto.AddBillItemRequest;
import com.nilanjan.backend.billing.api.dto.BillingResponse;
import com.nilanjan.backend.billing.api.dto.CreateBillRequest;
import com.nilanjan.backend.billing.api.dto.PaymentRequest;
import com.nilanjan.backend.billing.domain.Bill;
import com.nilanjan.backend.billing.domain.BillItem;
import com.nilanjan.backend.billing.domain.BillItemType;
import com.nilanjan.backend.billing.domain.BillStatus;
import com.nilanjan.backend.billing.domain.Payment;
import com.nilanjan.backend.billing.repository.BillRepository;
import com.nilanjan.backend.doctor.repository.DoctorRepository;
import com.nilanjan.backend.patient.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public BillingResponse createBill(CreateBillRequest request) {

        ObjectId appointmentId = null;
        if (request.appointmentId() != null && !request.appointmentId().isBlank())
            appointmentId = new ObjectId(request.appointmentId());

        Bill bill = Bill.builder()
                .billNumber(BillNumberGenerator.generate())
                .patientId(new ObjectId(request.patientId()))
                .appointmentId(appointmentId)
                .items(new ArrayList<>())
                .payments(new ArrayList<>())
                .subtotal(BigDecimal.ZERO)
                .tax(BigDecimal.ZERO)
                .discount(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                .amountPaid(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .status(null)
                .build();

        for (AddBillItemRequest itemRequest : request.items()) {
            BillItem item = buildBillItem(
                    itemRequest.description(),
                    itemRequest.type(),
                    itemRequest.quantity(),
                    itemRequest.unitPrice());
            bill.getItems().add(item);
        }

        recalculateTotals(bill);

        Bill saved = billRepository.save(bill);

        return mapToResponse(saved);

    }

    @Override
    public BillingResponse recordPayment(String billId, PaymentRequest request) {

        Bill bill = billRepository.findById(new ObjectId(billId))
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        if (bill.getStatus() == BillStatus.CANCELLED)
            throw new IllegalStateException("Cannot add payment to a cancelled bill");

        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Payment amount must be greater than zero");

        if (bill.getPayments() == null)
            bill.setPayments(new ArrayList<>());

        Payment payment = Payment.builder()
                .id(PaymentIdGenerator.generate())
                .amount(request.amount())
                .method(request.method())
                .reference(request.reference())
                .paidAt(Instant.now())
                .build();

        bill.getPayments().add(payment);

        BigDecimal newPaidAmount = bill.getAmountPaid().add(request.amount());
        bill.setAmountPaid(newPaidAmount);

        if (newPaidAmount.compareTo(bill.getTotalAmount()) >= 0)
            bill.setStatus(BillStatus.PAID);
        else
            bill.setStatus(BillStatus.PARTIALLY_PAID);

        bill.setUpdatedAt(Instant.now());

        Bill saved = billRepository.save(bill);

        return mapToResponse(saved);
    }

    @Override
    public void cancelBill(String billId) {

        Bill bill = billRepository.findById(new ObjectId(billId))
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setStatus(BillStatus.CANCELLED);
        bill.setUpdatedAt(Instant.now());

        billRepository.save(bill);
    }

    // HELPERS
    private BillingResponse mapToResponse(Bill bill) {

        String patientCode = patientRepository.findById(bill.getPatientId())
                .map(p -> p.getPatientCode())
                .orElse(null);
        String patientName = patientRepository.findById(bill.getPatientId())
                .map(p -> p.getFirstName() + " " + p.getLastName())
                .orElse("Unknown Patient");

        String appointmentIdStr = null;
        String appointmentCode = null;

        String doctorIdStr = null;
        String doctorCode = null;
        String doctorName = null;

        if (bill.getAppointmentId() != null) {
            var appointmentOpt = appointmentRepository.findById(bill.getAppointmentId());

            if (appointmentOpt.isPresent()) {
                var appointment = appointmentOpt.get();

                appointmentIdStr = appointment.getId().toHexString();
                appointmentCode = appointment.getAppointmentCode();

                ObjectId doctorId = appointment.getDoctorId();

                var doctorOpt = doctorRepository.findById(doctorId);
                if (doctorOpt.isPresent()) {
                    var doctor = doctorOpt.get();
                    doctorIdStr = doctor.getId().toHexString();
                    doctorCode = doctor.getDoctorCode();
                    doctorName = doctor.getFirstName() + " " + doctor.getLastName();
                }
            }
        }

        return new BillingResponse(
                bill.getId().toHexString(),
                bill.getBillNumber(),

                bill.getPatientId().toHexString(),
                patientCode,
                patientName,

                appointmentIdStr,
                appointmentCode,

                doctorIdStr,
                doctorCode,
                doctorName,

                bill.getItems(),
                bill.getSubtotal(),
                bill.getTax(),
                bill.getDiscount(),
                bill.getTotalAmount(),
                bill.getAmountPaid(),
                bill.getStatus(),
                bill.getUpdatedAt(),
                bill.getPayments());
    }

    private BillItem buildBillItem(String description,
            BillItemType type,
            Integer quantity,
            BigDecimal unitPrice) {

        BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(quantity));

        return BillItem.builder()
                .description(description)
                .type(type)
                .quantity(quantity)
                .unitPrice(unitPrice)
                .totalPrice(total)
                .build();
    }

    private void recalculateTotals(Bill bill) {

        BigDecimal subtotal = bill.getItems().stream()
                .map(BillItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal total = subtotal
                .add(bill.getTax())
                .subtract(bill.getDiscount());

        bill.setSubtotal(subtotal);
        bill.setTotalAmount(total);
        bill.setUpdatedAt(Instant.now());
    }

}
