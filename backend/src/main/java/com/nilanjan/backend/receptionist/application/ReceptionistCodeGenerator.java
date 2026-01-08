package com.nilanjan.backend.receptionist.application;

import java.time.Year;

public class ReceptionistCodeGenerator {

    public static String generate() {
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("REC-%d-06%d", year, suffix);
    }
}
