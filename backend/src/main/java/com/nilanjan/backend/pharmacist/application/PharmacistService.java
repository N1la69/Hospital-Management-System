package com.nilanjan.backend.pharmacist.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.pharmacist.api.dto.CreatePharmacistRequest;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistResponse;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistSearchFilter;
import com.nilanjan.backend.pharmacist.api.dto.UpdatePharmacistRequest;

public interface PharmacistService {

    PharmacistResponse createPharmacist(CreatePharmacistRequest request);

    PharmacistResponse updatePharmacist(String pharmacistId, UpdatePharmacistRequest request);

    void deletePharmacist(String pharmacistId);

    PharmacistResponse getPharmacistDetails(String pharmacistId);

    List<PharmacistResponse> getAllPharmacists();

    PageResponse<PharmacistResponse> advancedSearch(PharmacistSearchFilter filter, int page, int size);
}
