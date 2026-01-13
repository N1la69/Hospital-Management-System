package com.nilanjan.backend.receptionist.repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistSearchFilter;
import com.nilanjan.backend.receptionist.domain.Receptionist;

public interface ReceptionistSearchRepository {
    PageResult<Receptionist> search(ReceptionistSearchFilter filter, int page, int size);
}
