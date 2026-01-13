package com.nilanjan.backend.doctor.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.doctor.api.dto.DoctorSearchFilter;
import com.nilanjan.backend.doctor.domain.Doctor;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DoctorSearchRepositoryImpl implements DoctorSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public PageResult<Doctor> search(DoctorSearchFilter filter, int page, int size) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("firstName").regex(filter.name(), "i"),
                    Criteria.where("lastName").regex(filter.name(), "i"),
                    Criteria.where("doctorCode").regex(filter.name(), "i"),
                    Criteria.where("email").regex(filter.name(), "i"),
                    Criteria.where("qualification").regex(filter.name(), "i")));

        }

        if (filter.status() != null) {
            criteriaList.add(Criteria.where("status").is(filter.status()));
        }

        if (filter.specialization() != null) {
            criteriaList.add(Criteria.where("specialization").is(filter.specialization()));
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        long total = mongoTemplate.count(query, Doctor.class);

        query.skip((long) page * size);
        query.limit(size);

        List<Doctor> data = mongoTemplate.find(query, Doctor.class);

        return new PageResult<>(data, total);
    }

}
