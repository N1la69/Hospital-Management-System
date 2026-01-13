package com.nilanjan.backend.receptionist.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.receptionist.api.dto.CreateReceptionistRequest;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistResponse;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistSearchFilter;

public interface ReceptionistService {
    ReceptionistResponse createReceptionist(CreateReceptionistRequest request);

    List<ReceptionistResponse> getAllReceptionists();

    PageResponse<ReceptionistResponse> advancedSearch(ReceptionistSearchFilter filter, int page, int size);
}
