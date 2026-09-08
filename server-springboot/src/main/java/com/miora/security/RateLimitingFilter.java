package com.miora.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.miora.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Thread-Safe In-Memory Sliding Window Rate Limiting Filter for MIORA API.
 * Protects sensitive endpoints (payments, posting, messaging, safety reporting) from automated spam and abuse.
 */
@Component
@Order(1)
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static class ClientBucket {
        long windowStartMs;
        final AtomicInteger count = new AtomicInteger(0);

        ClientBucket(long windowStartMs) {
            this.windowStartMs = windowStartMs;
            this.count.set(1);
        }
    }

    // Map: clientKey -> ClientBucket
    private final ConcurrentHashMap<String, ClientBucket> buckets = new ConcurrentHashMap<>();
    private long lastCleanupMs = System.currentTimeMillis();

    private static final long WINDOW_MS = 60_000L; // 1 minute window

    // Tiered limits per 1-minute window
    private static final int LIMIT_PAYMENT = 20;
    private static final int LIMIT_CREATION = 30;
    private static final int LIMIT_MESSAGING = 60;
    private static final int LIMIT_SAFETY = 25;
    private static final int LIMIT_DEFAULT = 300;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip rate limiting for static health checks or preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || path.equals("/api/health") || path.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientKey = resolveClientKey(request, path);
        int maxAllowed = resolveLimitForPath(path, request.getMethod());

        long now = System.currentTimeMillis();
        cleanupStaleBucketsIfNecessary(now);

        ClientBucket bucket = buckets.compute(clientKey, (k, existing) -> {
            if (existing == null || (now - existing.windowStartMs) > WINDOW_MS) {
                return new ClientBucket(now);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        if (bucket != null && bucket.count.get() > maxAllowed) {
            log.warn("Rate limit exceeded for key '{}' on path '{}' (Count: {}, Max: {})",
                    clientKey, path, bucket.count.get(), maxAllowed);

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", "60");

            ApiResponse<Void> errorResponse = ApiResponse.error("Too many requests. Please slow down and try again in a few moments.");
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientKey(HttpServletRequest request, String path) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        } else if (clientIp.contains(",")) {
            clientIp = clientIp.split(",")[0].trim();
        }

        String authHeader = request.getHeader("Authorization");
        String identity = (authHeader != null && authHeader.startsWith("Bearer "))
                ? "auth_" + authHeader.substring(7, Math.min(authHeader.length(), 25)).hashCode()
                : "ip_" + clientIp;

        return identity + ":" + getRouteBucketCategory(path);
    }

    private String getRouteBucketCategory(String path) {
        if (path.contains("/wallet/payment") || path.contains("/wallet/recharge") || path.contains("/wallet/gift")) {
            return "wallet";
        }
        if (path.contains("/feed/posts") || path.contains("/feed/stories") || path.contains("/user/status-note")) {
            return "create";
        }
        if (path.contains("/messages") || path.contains("/likes") || path.contains("/passes")) {
            return "social";
        }
        if (path.contains("/report") || path.contains("/block")) {
            return "safety";
        }
        return "general";
    }

    private int resolveLimitForPath(String path, String method) {
        if (path.contains("/wallet/payment") || path.contains("/wallet/recharge") || path.contains("/wallet/gift")) {
            return LIMIT_PAYMENT;
        }
        if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method) || "DELETE".equalsIgnoreCase(method)) {
            if (path.contains("/feed/posts") || path.contains("/feed/stories") || path.contains("/user/status-note")) {
                return LIMIT_CREATION;
            }
            if (path.contains("/messages") || path.contains("/likes") || path.contains("/passes")) {
                return LIMIT_MESSAGING;
            }
            if (path.contains("/report") || path.contains("/block")) {
                return LIMIT_SAFETY;
            }
        }
        return LIMIT_DEFAULT;
    }

    private void cleanupStaleBucketsIfNecessary(long now) {
        if (now - lastCleanupMs > 300_000L) { // Every 5 minutes
            lastCleanupMs = now;
            buckets.entrySet().removeIf(entry -> (now - entry.getValue().windowStartMs) > (WINDOW_MS * 2));
        }
    }
}
