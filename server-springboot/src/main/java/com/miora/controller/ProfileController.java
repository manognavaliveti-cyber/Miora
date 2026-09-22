package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.model.Profile;
import com.miora.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Profile>>> getProfiles() {
        List<Profile> profiles = profileService.getAllProfiles();
        return ResponseEntity.ok(ApiResponse.ok(profiles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Profile>> getProfileById(@PathVariable String id) {
        Profile profile = profileService.getProfileById(id);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
