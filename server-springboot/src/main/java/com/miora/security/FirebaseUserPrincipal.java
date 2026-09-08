package com.miora.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FirebaseUserPrincipal {
    private String uid;
    private String email;
    private String name;
    private String picture;
    private boolean emailVerified;
    private Map<String, Object> claims;
}
