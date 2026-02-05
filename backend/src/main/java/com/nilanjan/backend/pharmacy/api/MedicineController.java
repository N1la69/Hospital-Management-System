package com.nilanjan.backend.pharmacy.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilanjan.backend.pharmacy.repository.MedicineRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pharmacy/medicines")
public class MedicineController {

    private final MedicineRepository medicineRepository;
}
