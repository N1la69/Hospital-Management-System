package com.nilanjan.backend.common.dto;

import java.util.List;

public record PageResult<T>(
        List<T> data,
        long total) {

}
