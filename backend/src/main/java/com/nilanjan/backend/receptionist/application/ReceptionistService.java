package com.nilanjan.backend.receptionist.application;

import java.util.List;

import com.nilanjan.backend.receptionist.api.dto.CreateReceptionistRequest;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistResponse;

public interface ReceptionistService {
    ReceptionistResponse createReceptionist(CreateReceptionistRequest request);

    List<ReceptionistResponse> getAllReceptionists();

    ReceptionistResponse getReceptionistById(String receptionistId);
}
