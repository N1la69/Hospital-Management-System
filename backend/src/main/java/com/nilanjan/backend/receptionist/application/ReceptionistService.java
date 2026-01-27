package com.nilanjan.backend.receptionist.application;

import java.util.List;

import com.nilanjan.backend.common.dto.PageResponse;
import com.nilanjan.backend.receptionist.api.dto.CreateReceptionistRequest;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistResponse;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistSearchFilter;
import com.nilanjan.backend.receptionist.api.dto.UpdateReceptionistRequest;

public interface ReceptionistService {
    ReceptionistResponse createReceptionist(CreateReceptionistRequest request);

    ReceptionistResponse updateReceptionist(String receptionistId, UpdateReceptionistRequest request);

    void deleteReceptionist(String receptionistId);

    ReceptionistResponse getReceptionistDetails(String receptionistId);

    List<ReceptionistResponse> getAllReceptionists();

    PageResponse<ReceptionistResponse> advancedSearch(ReceptionistSearchFilter filter, int page, int size);
}
