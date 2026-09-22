package com.miora.service;

import com.miora.model.Profile;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final FirestoreService firestoreService;

    public ProfileService(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public List<Profile> getAllProfiles() {
        return firestoreService.getProfiles();
    }

    public Profile getProfileById(String id) {
        return firestoreService.getProfileById(id);
    }
}
