package com.nilanjan.backend.billing.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.bson.types.ObjectId;
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
    public PageResult<Bill> search(BillSearchFilter filter, Set<ObjectId> patientIds, Set<ObjectId> appointmentIds,
            int page, int size) {

        List<Criteria> andCriteria = new ArrayList<>();
        List<Criteria> orCriteria = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            orCriteria.add(Criteria.where("billNumber").regex(filter.name(), "i"));

            if (patientIds != null && !patientIds.isEmpty()) {
                orCriteria.add(Criteria.where("patientId").in(patientIds));
            }

            if (appointmentIds != null && !appointmentIds.isEmpty()) {
                orCriteria.add(Criteria.where("appointmentId").in(appointmentIds));
            }

            if (orCriteria.isEmpty()) {
                return new PageResult<>(List.of(), 0);
            }

            andCriteria.add(new Criteria().orOperator(orCriteria.toArray(new Criteria[0])));
        }

        if (filter.paymentStatus() != null && !filter.paymentStatus().isBlank()) {
            andCriteria.add(
                    Criteria.where("status").is(filter.paymentStatus()));
        }

        if (filter.paymentMethod() != null && !filter.paymentMethod().isBlank()) {
            andCriteria.add(
                    Criteria.where("payments")
                            .elemMatch(Criteria.where("method")
                                    .is(filter.paymentMethod())));
        }

        if (filter.fromDate() != null && filter.toDate() != null) {
            Instant from = Instant.parse(filter.fromDate());
            Instant to = Instant.parse(filter.toDate());

            andCriteria.add(
                    Criteria.where("createdAt").gte(from).lte(to));
        } else if (filter.fromDate() != null) {
            andCriteria.add(
                    Criteria.where("createdAt")
                            .gte(Instant.parse(filter.fromDate())));
        } else if (filter.toDate() != null) {
            andCriteria.add(
                    Criteria.where("createdAt")
                            .lte(Instant.parse(filter.toDate())));
        }

        Criteria finalCriteria = new Criteria();
        if (!andCriteria.isEmpty()) {
            finalCriteria.andOperator(andCriteria.toArray(new Criteria[0]));
        }

        Query query = new Query(finalCriteria);
        query.with(Sort.by(Sort.Direction.DESC, "updatedAt"));

        long total = mongoTemplate.count(query, Bill.class);

        query.skip((long) page * size).limit(size);

        List<Bill> data = mongoTemplate.find(query, Bill.class);

        return new PageResult<>(data, total);
    }

}
