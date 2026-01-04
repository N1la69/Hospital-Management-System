package com.nilanjan.backend.auth.event;

import org.bson.types.ObjectId;

public record UserLoggedInEvent(ObjectId userId) {
    
}
