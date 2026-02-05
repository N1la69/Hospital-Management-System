package com.nilanjan.backend.pharmacy.domain;

public enum StockTransactionType {
    IN, // purchase
    OUT, // sale
    ADJUST, // correction
    RETURN // patient return
}
