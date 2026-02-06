package com.nilanjan.backend.pharmacy.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.pharmacy.api.dto.MedicineSearchFilter;
import com.nilanjan.backend.pharmacy.domain.Medicine;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MedicineSearchRepositoryImpl implements MedicineSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public PageResult<Medicine> search(MedicineSearchFilter filter, int page, int size) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("name").regex(filter.name(), "i"),
                    Criteria.where("manufacturer").regex(filter.name(), "i"),
                    Criteria.where("unit").regex(filter.name(), "i")));
        }

        if (filter.category() != null) {
            criteriaList.add(Criteria.where("category").is(filter.category()));
        }

        if (filter.status() != null) {
            criteriaList.add(Criteria.where("status").is(filter.status()));
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        long total = mongoTemplate.count(query, Medicine.class);

        query.skip((long) page * size);
        query.limit(size);

        List<Medicine> data = mongoTemplate.find(query, Medicine.class);

        return new PageResult<>(data, total);
    }

}
