package com.nilanjan.backend.pharmacist.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.pharmacist.api.dto.PharmacistSearchFilter;
import com.nilanjan.backend.pharmacist.domain.Pharmacist;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PharmacistSearchRepositoryImpl implements PharmacistSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public PageResult<Pharmacist> search(PharmacistSearchFilter filter, int page, int size) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("firstName").regex(filter.name(), "i"),
                    Criteria.where("lastName").regex(filter.name(), "i"),
                    Criteria.where("pharmacistCode").regex(filter.name(), "i"),
                    Criteria.where("contact.email").regex(filter.name(), "i")));
        }

        if (filter.status() != null) {
            criteriaList.add(Criteria.where("status").is(filter.status()));
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        long total = mongoTemplate.count(query, Pharmacist.class);

        query.skip((long) page * size);
        query.limit(size);

        List<Pharmacist> data = mongoTemplate.find(query, Pharmacist.class);

        return new PageResult<>(data, total);
    }

}
