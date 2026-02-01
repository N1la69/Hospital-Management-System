package com.nilanjan.backend.billing.repository;

import com.nilanjan.backend.billing.api.dto.BillSearchFilter;
import com.nilanjan.backend.billing.domain.Bill;
import com.nilanjan.backend.common.dto.PageResult;

public interface BillSearchRepository {
    PageResult<Bill> search(BillSearchFilter filter, int page, int size);
}
