package com.nilanjan.backend.pharmacy.application;

import java.time.Year;

public class MedicineCodeGenerator {

    public static String generate() {
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("MED-%d-06%d", year, suffix);
    }
}
