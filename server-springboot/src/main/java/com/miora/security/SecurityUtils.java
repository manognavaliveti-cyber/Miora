package com.miora.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Security utility helpers to safely access the authenticated Firebase principal.
 * Uses the verified Firebase UID as the single source of truth across all controllers and services.
 */
public final class SecurityUtils {

    private SecurityUtils() {}

    public static FirebaseUserPrincipal getCurrentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof FirebaseUserPrincipal principal) {
            return principal;
        }
        return null;
    }

    public static String getAuthenticatedUserIdOrNull() {
        FirebaseUserPrincipal principal = getCurrentPrincipal();
        return principal != null ? principal.getUid() : null;
    }

    public static String getRequiredUserId() {
        FirebaseUserPrincipal principal = getCurrentPrincipal();
        if (principal == null || principal.getUid() == null || principal.getUid().trim().isEmpty()) {
            throw new SecurityException("Authentication required: No valid Firebase user principal in security context.");
        }
        return principal.getUid();
    }

    public static String getCurrentUserId() {
        FirebaseUserPrincipal principal = getCurrentPrincipal();
        return principal != null ? principal.getUid() : "user_me";
    }

    public static String getCurrentUserEmail() {
        FirebaseUserPrincipal principal = getCurrentPrincipal();
        return principal != null ? principal.getEmail() : "alex@miora.app";
    }
}
