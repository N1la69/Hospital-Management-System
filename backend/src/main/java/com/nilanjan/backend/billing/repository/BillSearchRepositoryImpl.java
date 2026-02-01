package com.nilanjan.backend.billing.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.billing.api.dto.BillSearchFilter;
import com.nilanjan.backend.billing.domain.Bill;
import com.nilanjan.backend.common.dto.PageResult;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BillSearchRepositoryImpl implements BillSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public PageResult<Bill> search(BillSearchFilter filter, int page, int size) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("billNumber").regex(filter.name(), "i")));
        }

        if (filter.paymentStatus() != null && !filter.paymentStatus().isBlank()) {
            criteriaList.add(
                    Criteria.where("status").is(filter.paymentStatus()));
        }

        if (filter.paymentMethod() != null && !filter.paymentMethod().isBlank()) {
            criteriaList.add(
                    Criteria.where("payments")
                            .elemMatch(Criteria.where("method")
                                    .is(filter.paymentMethod())));
        }

        if (filter.fromDate() != null && filter.toDate() != null) {
            Instant from = Instant.parse(filter.fromDate());
            Instant to = Instant.parse(filter.toDate());

            criteriaList.add(
                    Criteria.where("createdAt").gte(from).lte(to));
        } else if (filter.fromDate() != null) {
            criteriaList.add(
                    Criteria.where("createdAt")
                            .gte(Instant.parse(filter.fromDate())));
        } else if (filter.toDate() != null) {
            criteriaList.add(
                    Criteria.where("createdAt")
                            .lte(Instant.parse(filter.toDate())));
        }

        Criteria criteria = new Criteria();
        if (!criteriaList.isEmpty()) {
            criteria.andOperator(criteriaList.toArray(new Criteria[0]));
        }

        Query query = new Query(criteria);
        query.with(Sort.by(Sort.Direction.DESC, "updatedAt"));

        long total = mongoTemplate.count(query, Bill.class);

        query.skip((long) page * size).limit(size);

        List<Bill> data = mongoTemplate.find(query, Bill.class);

        return new PageResult<>(data, total);
    }

}
