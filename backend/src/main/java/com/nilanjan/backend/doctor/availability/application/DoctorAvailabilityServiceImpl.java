package com.nilanjan.backend.doctor.availability.application;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.nilanjan.backend.doctor.availability.api.dto.CreateAvailabilityRequest;
import com.nilanjan.backend.doctor.availability.api.dto.DoctorAvailabilityResponse;
import com.nilanjan.backend.doctor.availability.domain.DoctorAvailability;
import com.nilanjan.backend.doctor.availability.repository.DoctorAvailabilityRepository;
import com.nilanjan.backend.doctor.repository.DoctorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

        private final DoctorAvailabilityRepository doctorAvailabilityRepository;
        private final DoctorRepository doctorRepository;

        @Override
        public DoctorAvailabilityResponse addAvailability(CreateAvailabilityRequest request) {

                ZoneId zone = ZoneId.systemDefault();

                LocalTime startLocal = request.startTime()
                                .atZone(zone)
                                .toLocalTime();

                LocalTime endLocal = request.endTime()
                                .atZone(zone)
                                .toLocalTime();

                Instant start = startLocal
                                .atDate(LocalDate.of(1970, 1, 5))
                                .atZone(zone)
                                .toInstant();

                Instant end = endLocal
                                .atDate(LocalDate.of(1970, 1, 5))
                                .atZone(zone)
                                .toInstant();

                System.out.println("REQUEST start=" + start);
                System.out.println("REQUEST end=" + end);
                System.out.println("slotMinutes=" + request.slotMinutes());

                if (!start.isBefore(end))
                        throw new RuntimeException("Start time must be before end time");

                DayOfWeek actualDay = start
                                .atZone(ZoneId.systemDefault())
                                .toLocalDate()
                                .getDayOfWeek();

                if (actualDay != request.dayOfWeek()) {
                        throw new RuntimeException(
                                        "DayOfWeek does not match startTime");
                }

                long minutes = Duration.between(start, end).toMinutes();
                if (minutes % request.slotMinutes() != 0)
                        throw new RuntimeException("Time window must align with slot duration");

                ObjectId doctorId;
                try {
                        doctorId = new ObjectId(request.doctorId());
                        System.out.print("ID: " + doctorId);
                } catch (Exception e) {
                        throw new RuntimeException("Invalid doctorId format");
                }

                if (!doctorRepository.existsById(doctorId)) {
                        throw new RuntimeException("Doctor not found for id: " + request.doctorId());
                }

                List<DoctorAvailability> existing = doctorAvailabilityRepository.findByDoctorIdAndDayOfWeek(doctorId,
                                request.dayOfWeek());

                existing.forEach(a -> {
                        System.out.println("EXISTING start=" + a.getStartTime());
                        System.out.println("EXISTING end=" + a.getEndTime());
                });

                for (DoctorAvailability a : existing) {
                        boolean overlaps = start.isBefore(a.getEndTime()) && end.isAfter(a.getStartTime());

                        if (overlaps)
                                throw new RuntimeException("Availability overlaps existing schedule");
                }

                DoctorAvailability availability = DoctorAvailability.builder()
                                .doctorId(doctorId)
                                .dayOfWeek(request.dayOfWeek())
                                .startTime(start)
                                .endTime(end)
                                .slotMinutes(request.slotMinutes())
                                .build();

                DoctorAvailability saved = doctorAvailabilityRepository.save(availability);

                return mapToResponse(saved);
        }

        @Override
        public List<DoctorAvailabilityResponse> getAvailability(String doctorId) {

                return doctorAvailabilityRepository.findByDoctorId(new ObjectId(doctorId))
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private DoctorAvailabilityResponse mapToResponse(DoctorAvailability a) {
                return new DoctorAvailabilityResponse(
                                a.getId().toHexString(),
                                a.getDayOfWeek(),
                                a.getStartTime(),
                                a.getEndTime(),
                                a.getSlotMinutes());
        }

}
