package com.nilanjan.backend.billing.application;

import com.nilanjan.backend.billing.api.dto.BillSearchFilter;
import com.nilanjan.backend.billing.api.dto.BillingResponse;
import com.nilanjan.backend.billing.api.dto.CreateBillRequest;
import com.nilanjan.backend.billing.api.dto.PaymentRequest;
import com.nilanjan.backend.common.dto.PageResponse;

public interface BillingService {

    BillingResponse createBill(CreateBillRequest request);

    void cancelBill(String billId);

    BillingResponse getBillDetails(String billId);

    PageResponse<BillingResponse> advancedSearch(BillSearchFilter filter, int page, int size);

    BillingResponse recordPayment(String billId, PaymentRequest request);

}
