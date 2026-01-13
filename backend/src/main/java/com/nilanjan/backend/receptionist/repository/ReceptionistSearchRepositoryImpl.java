package com.nilanjan.backend.receptionist.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.common.dto.PageResult;
import com.nilanjan.backend.receptionist.api.dto.ReceptionistSearchFilter;
import com.nilanjan.backend.receptionist.domain.Receptionist;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReceptionistSearchRepositoryImpl implements ReceptionistSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public PageResult<Receptionist> search(ReceptionistSearchFilter filter, int page, int size) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("firstName").regex(filter.name(), "i"),
                    Criteria.where("lastName").regex(filter.name(), "i"),
                    Criteria.where("receptionistCode").regex(filter.name(), "i"),
                    Criteria.where("contact.email").regex(filter.name(), "i")));
        }

        if (filter.status() != null) {
            criteriaList.add(Criteria.where("status").is(filter.status()));
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        long total = mongoTemplate.count(query, Receptionist.class);

        query.skip((long) page * size);
        query.limit(size);

        List<Receptionist> data = mongoTemplate.find(query, Receptionist.class);

        return new PageResult<>(data, total);
    }

}
