package com.nilanjan.backend.pharmacist.application;

import java.time.Year;

public class PharmacistCodeGenerator {

    public static String generate() {
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("PRM-%d-06%d", year, suffix);
    }
}
