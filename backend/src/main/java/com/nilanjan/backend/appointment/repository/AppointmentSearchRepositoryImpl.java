package com.nilanjan.backend.appointment.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.appointment.api.dto.AppointmentSearchFilter;
import com.nilanjan.backend.appointment.domain.Appointment;
import com.nilanjan.backend.common.dto.PageResult;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AppointmentSearchRepositoryImpl implements AppointmentSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public PageResult<Appointment> search(AppointmentSearchFilter filter, int page, int size, Set<ObjectId> patientIds,
            Set<ObjectId> doctorIds) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.appointmentCode() != null && !filter.appointmentCode().isBlank()) {
            criteriaList.add(Criteria.where("appointmentCode").regex(filter.appointmentCode(), "i"));
        }

        if (filter.status() != null) {
            criteriaList.add(Criteria.where("status").is(filter.status()));
        }

        if (patientIds != null) {
            criteriaList.add(Criteria.where("patientId").in(patientIds));
        }

        if (doctorIds != null) {
            criteriaList.add(Criteria.where("doctorId").in(doctorIds));
        }

        if (filter.date() != null || filter.fromTime() != null || filter.toTime() != null) {
            Criteria timeCriteria = Criteria.where("scheduledStart");

            if (filter.date() != null) {
                Instant startOfDay = filter.date().truncatedTo(java.time.temporal.ChronoUnit.DAYS);
                Instant endOfDay = startOfDay.plus(1, java.time.temporal.ChronoUnit.DAYS);

                timeCriteria = timeCriteria.gte(startOfDay).lt(endOfDay);
            }

            if (filter.fromTime() != null)
                timeCriteria = timeCriteria.gte(filter.fromTime());

            if (filter.toTime() != null)
                timeCriteria = timeCriteria.lte(filter.toTime());

            criteriaList.add(timeCriteria);
        }

        Query query = new Query();

        for (Criteria c : criteriaList) {
            query.addCriteria(c);
        }

        long total = mongoTemplate.count(query, Appointment.class);

        query.skip((long) page * size);
        query.limit(size);

        List<Appointment> data = mongoTemplate.find(query, Appointment.class);

        return new PageResult<>(data, total);
    }

}
