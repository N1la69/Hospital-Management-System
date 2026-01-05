package com.nilanjan.backend.doctor.application;

import java.time.Year;

public class DoctorCodeGenerator {

    public static String generate() {
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("DOC-%d-%06d", year, suffix);
    }
}
