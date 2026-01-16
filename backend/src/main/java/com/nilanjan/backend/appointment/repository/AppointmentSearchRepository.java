package com.nilanjan.backend.appointment.repository;

import java.util.Set;

import org.bson.types.ObjectId;

import com.nilanjan.backend.appointment.api.dto.AppointmentSearchFilter;
import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.common.dto.PageResult;

public interface AppointmentSearchRepository {

    PageResult<Appointment> search(AppointmentSearchFilter filter, int page, int size, Set<ObjectId> patientIds,
            Set<ObjectId> doctorIds);
}
