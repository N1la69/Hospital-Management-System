package com.nilanjan.backend.appointment.domain;

import java.util.Set;

public class AppointmentTransitions {

    public static final Set<AppointmentStatus> FROM_SCHEDULED = Set.of(AppointmentStatus.CHECKED_IN,
            AppointmentStatus.CANCELED, AppointmentStatus.NO_SHOW);

    public static final Set<AppointmentStatus> FROM_CHECKED_IN = Set.of(AppointmentStatus.IN_PROGRESS,
            AppointmentStatus.CANCELED);

    public static final Set<AppointmentStatus> FROM_IN_PROGRESS = Set.of(AppointmentStatus.COMPLETED);
}
