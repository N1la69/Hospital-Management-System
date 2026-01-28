package com.nilanjan.backend.appointment.domain;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public final class AppointmentStateMachine {

    private static final Map<AppointmentStatus, Set<AppointmentStatus>> transitions = new EnumMap<>(
            AppointmentStatus.class);

    static {
        transitions.put(AppointmentStatus.SCHEDULED, EnumSet.of(
                AppointmentStatus.CHECKED_IN, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW));

        transitions.put(AppointmentStatus.CHECKED_IN, EnumSet.of(
                AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED));

        transitions.put(AppointmentStatus.COMPLETED, EnumSet.noneOf(AppointmentStatus.class));
        transitions.put(AppointmentStatus.CANCELLED, EnumSet.noneOf(AppointmentStatus.class));
        transitions.put(AppointmentStatus.NO_SHOW, EnumSet.noneOf(AppointmentStatus.class));
    }

    private AppointmentStateMachine() {
    }

    public static boolean canTransition(AppointmentStatus from, AppointmentStatus to) {
        return transitions.getOrDefault(from, Set.of()).contains(to);
    }
}
