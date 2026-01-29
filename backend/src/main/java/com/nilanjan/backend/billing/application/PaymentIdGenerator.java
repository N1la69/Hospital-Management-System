package com.nilanjan.backend.billing.application;

import java.time.Year;

public class PaymentIdGenerator {

    public static String generate() {
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("PMNT-%d-%06d", year, suffix);
    }
}
