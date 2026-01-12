package com.nilanjan.backend.patient.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.nilanjan.backend.patient.api.dto.PatientSearchFilter;
import com.nilanjan.backend.patient.domain.Patient;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PatientSearchRepositoryImpl implements PatientSearchRepository {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Patient> search(PatientSearchFilter filter) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (filter.name() != null && !filter.name().isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("firstName").regex(filter.name(), "i"),
                    Criteria.where("lastName").regex(filter.name(), "i"),
                    Criteria.where("patientCode").regex(filter.name(), "i"),
                    Criteria.where("email").regex(filter.name(), "i")));

        }

        if (filter.patientCode() != null && !filter.patientCode().isBlank()) {
            criteriaList.add(Criteria.where("patientCode").is(filter.patientCode()));
        }

        if (filter.email() != null && !filter.email().isBlank()) {
            criteriaList.add(Criteria.where("email").regex(filter.email(), "i"));
        }

        if (filter.bloodGroup() != null) {
            criteriaList.add(Criteria.where("bloodGroup").is(filter.bloodGroup()));
        }

        if (filter.status() != null) {
            criteriaList.add(Criteria.where("status").is(filter.status()));
        }

        if (filter.gender() != null) {
            criteriaList.add(Criteria.where("gender").is(filter.gender()));
        }

        if (filter.dobFrom() != null || filter.dobTo() != null) {
            Criteria dobCriteria = Criteria.where("dateOfBirth");

            if (filter.dobFrom() != null)
                dobCriteria = dobCriteria.gte(filter.dobFrom());

            if (filter.dobTo() != null)
                dobCriteria = dobCriteria.lte(filter.dobTo());

            criteriaList.add(dobCriteria);
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        return mongoTemplate.find(query, Patient.class);
    }

}
