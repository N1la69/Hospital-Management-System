package com.nilanjan.backend.pharmacist.repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistSearchFilter;
import com.nilanjan.backend.pharmacist.domain.Pharmacist;

public interface PharmacistSearchRepository {
    PageResult<Pharmacist> search(PharmacistSearchFilter filter, int page, int size);
}
