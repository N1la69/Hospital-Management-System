package com.nilanjan.backend.pharmacy.repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.pharmacy.api.dto.MedicineSearchFilter;
import com.nilanjan.backend.pharmacy.domain.Medicine;

public interface MedicineSearchRepository {
    PageResult<Medicine> search(MedicineSearchFilter filter, int page, int size);
}
