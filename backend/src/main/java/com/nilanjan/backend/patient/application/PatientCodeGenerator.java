package com.nilanjan.backend.patient.application;

import java.time.Year;

public class PatientCodeGenerator {
    
    public static String generate(){
        int year = Year.now().getValue();
        long suffix = System.currentTimeMillis() % 1_000_000;

        return String.format("PAT-%d-%06d", year, suffix);
    }
}
