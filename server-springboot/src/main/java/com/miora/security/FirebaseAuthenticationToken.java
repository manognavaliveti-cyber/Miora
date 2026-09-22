package com.miora.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final FirebaseUserPrincipal principal;
    private final String credentials;

    public FirebaseAuthenticationToken(FirebaseUserPrincipal principal, String token) {
        // Default constructor for backward compatibility – grants only ROLE_USER.
        super(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        this.principal = principal;
        this.credentials = token;
        setAuthenticated(true);
    }

    public FirebaseAuthenticationToken(FirebaseUserPrincipal principal, String token, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = token;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return credentials;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }
}
