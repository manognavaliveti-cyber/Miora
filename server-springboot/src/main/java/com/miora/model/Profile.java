package com.miora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    private String id;
    private String name;
    private Integer age;
    private String location;
    private Double distanceKm;
    private String bio;
    @Builder.Default
    private List<String> photos = new ArrayList<>();
    @Builder.Default
    private List<String> interests = new ArrayList<>();
    private Integer compatibility;
    @Builder.Default
    private Boolean online = false;
    private String gender;
    private String occupation;
    private String education;
    private String height;
    @Builder.Default
    private Map<String, String> lifestyle = new HashMap<>();
    @Builder.Default
    private List<String> matchedInterests = new ArrayList<>();
    @Builder.Default
    private Boolean likedByCurrentUser = false;
    @Builder.Default
    private Map<String, Integer> receivedGifts = new HashMap<>();
    @Builder.Default
    private Integer gamesPlayedCount = 0;
    @Builder.Default
    private Boolean verified = true;
}
