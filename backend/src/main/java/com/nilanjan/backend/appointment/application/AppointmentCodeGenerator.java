package com.nilanjan.backend.appointment.application;

import java.time.Year;

public class AppointmentCodeGenerator {

    public static String generate() {
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("APT-%d-%06d", year, suffix);
    }
}
