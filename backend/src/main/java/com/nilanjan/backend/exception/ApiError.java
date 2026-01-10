package com.nilanjan.backend.exception;

import java.time.Instant;

import lombok.Getter;

@Getter
public class ApiError {
    private final String message;
    private final int status;
    private final Instant timestamp;

    public ApiError(String message, int status) {
        this.message = message;
        this.status = status;
        this.timestamp = Instant.now();
    }
}
