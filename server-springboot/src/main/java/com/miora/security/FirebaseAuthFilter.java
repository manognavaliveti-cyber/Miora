package com.miora.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthFilter.class);

    @Autowired(required = false)
    private FirebaseAuth firebaseAuth;

    @Value("${firebase.dev-fallback-enabled:true}")
    private boolean devFallbackEnabled;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String idToken = authHeader.substring(7).trim();

            if (StringUtils.hasText(idToken)) {
                try {
                    FirebaseUserPrincipal principal = null;

                    if (firebaseAuth != null) {
                        try {
                            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
                            principal = FirebaseUserPrincipal.builder()
                                    .uid(decodedToken.getUid())
                                    .email(decodedToken.getEmail())
                                    .name(decodedToken.getName())
                                    .picture(decodedToken.getPicture())
                                    .emailVerified(decodedToken.isEmailVerified())
                                    .claims(decodedToken.getClaims())
                                    .build();
                            log.debug("Successfully verified Firebase ID token for UID: {}", principal.getUid());
                        } catch (Exception authEx) {
                            log.debug("Live Firebase token verification failed: {}", authEx.getMessage());
                            if (!devFallbackEnabled) {
                                throw authEx;
                            }
                        }
                    }

                    // Dev Fallback Mode: Allows local testing with mock/dev tokens if Firebase Admin keys aren't set yet
                    if (principal == null && devFallbackEnabled) {
                        log.debug("Using Dev Fallback principal for Bearer token");
                        String devUid = "user_me";
                        String devEmail = "alex@miora.app";

                        // If token contains mock json or id, parse lightly
                        if (idToken.contains("@")) {
                            devEmail = idToken;
                            devUid = "user_" + idToken.replace("@", "_").replace(".", "_");
                        }

                        principal = FirebaseUserPrincipal.builder()
                                .uid(devUid)
                                .email(devEmail)
                                .name("Alex Rivera")
                                .emailVerified(true)
                                .claims(new HashMap<>())
                                .build();
                    }

                    if (principal != null) {
                        FirebaseAuthenticationToken authentication =
                                new FirebaseAuthenticationToken(principal, idToken);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception e) {
                    log.error("Failed to authenticate Firebase ID token: {}", e.getMessage());
                    SecurityContextHolder.clearContext();
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
