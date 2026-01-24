package com.nilanjan.backend.patient.medical.application;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.patient.medical.api.dto.CreateMedicalRecordRequest;
import com.nilanjan.backend.patient.medical.api.dto.DiagnosisDto;
import com.nilanjan.backend.patient.medical.api.dto.MedicalRecordResponse;
import com.nilanjan.backend.patient.medical.api.dto.MedicationDto;
import com.nilanjan.backend.patient.medical.api.dto.VitalsDto;
import com.nilanjan.backend.patient.medical.domain.Diagnosis;
import com.nilanjan.backend.patient.medical.domain.MedicalRecord;
import com.nilanjan.backend.patient.medical.domain.Medication;
import com.nilanjan.backend.patient.medical.domain.Vitals;
import com.nilanjan.backend.patient.medical.repository.MedicalRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

        private final MedicalRecordRepository medicalRecordRepository;

        @Override
        public MedicalRecordResponse create(CreateMedicalRecordRequest request) {

                MedicalRecord record = MedicalRecord.builder()
                                .patientId(new ObjectId(request.patientId()))
                                .manualEntry(request.manualEntry())
                                .visitDate(request.visitDate())
                                .diagnosis(mapDiagnosis(request.diagnosis()))
                                .vitals(mapVitals(request.vitals()))
                                .medications(mapMedications(request.medications()))
                                .notes(request.notes())
                                .createdAt(Instant.now())
                                .updatedAt(Instant.now())
                                .build();

                MedicalRecord saved = medicalRecordRepository.save(record);
                return mapToResponse(saved);

        }

        @Override
        public List<MedicalRecordResponse> getByPatientId(String patientId) {

                return medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(new ObjectId(patientId))
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private Diagnosis mapDiagnosis(DiagnosisDto dto) {
                return new Diagnosis(
                                dto.primaryDiagnosis(),
                                dto.secondaryDiagnosis(),
                                dto.symptoms(),
                                dto.clinicalNotes());
        }

        private Vitals mapVitals(VitalsDto dto) {
                return new Vitals(
                                dto.height(), dto.weight(), dto.bloodPressure(),
                                dto.temperature(), dto.pulse(), dto.oxygenSaturation());
        }

        private List<Medication> mapMedications(List<MedicationDto> list) {
                if (list == null)
                        return List.of();

                return list.stream()
                                .map(m -> new Medication(
                                                m.name(), m.dosage(), m.frequency(), m.duration()))
                                .collect(Collectors.toList());
        }

        private MedicalRecordResponse mapToResponse(MedicalRecord record) {
                return new MedicalRecordResponse(
                                record.getId().toHexString(),
                                record.getPatientId().toHexString(),
                                record.isManualEntry(),
                                record.getVisitDate(),
                                new DiagnosisDto(
                                                record.getDiagnosis().getPrimaryDiagnosis(),
                                                record.getDiagnosis().getSecondaryDiagnosis(),
                                                record.getDiagnosis().getSymptoms(),
                                                record.getDiagnosis().getClinicalNotes()),
                                new VitalsDto(
                                                record.getVitals().getHeight(),
                                                record.getVitals().getWeight(),
                                                record.getVitals().getBloodPressure(),
                                                record.getVitals().getTemperature(),
                                                record.getVitals().getPulse(),
                                                record.getVitals().getOxygenSaturation()),
                                record.getMedications().stream()
                                                .map(m -> new MedicationDto(m.getName(), m.getDosage(),
                                                                m.getFrequency(), m.getDuration()))
                                                .collect(Collectors.toList()),
                                record.getNotes(),
                                record.getCreatedAt(),
                                record.getUpdatedAt());
        }

}
