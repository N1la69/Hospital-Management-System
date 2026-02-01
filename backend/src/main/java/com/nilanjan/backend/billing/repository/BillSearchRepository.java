package com.nilanjan.backend.billing.repository;

import java.util.Set;

import org.bson.types.ObjectId;

import com.nilanjan.backend.billing.api.dto.BillSearchFilter;
import com.nilanjan.backend.billing.domain.Bill;
import com.nilanjan.backend.common.dto.PageResult;

public interface BillSearchRepository {
    PageResult<Bill> search(BillSearchFilter filter, Set<ObjectId> patientIds, Set<ObjectId> appointmentIds, int page,
            int size);
}
