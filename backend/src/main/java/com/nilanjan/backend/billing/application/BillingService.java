package com.nilanjan.backend.billing.application;

import com.nilanjan.backend.billing.api.dto.BillingResponse;
import com.nilanjan.backend.billing.api.dto.CreateBillRequest;
import com.nilanjan.backend.billing.api.dto.PaymentRequest;

public interface BillingService {

    BillingResponse createBill(CreateBillRequest request);

    void cancelBill(String billId);

    BillingResponse recordPayment(String billId, PaymentRequest request);

}
