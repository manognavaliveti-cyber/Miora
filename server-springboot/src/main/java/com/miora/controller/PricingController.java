package com.miora.controller;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.miora.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * GET /api/pricing
 *
 * Public endpoint — no auth required (see SecurityConfig permitAll list).
 * Serves dynamic pricing settings from Firestore (app_settings/pricing),
 * falling back to hardcoded defaults if Firestore is unavailable.
 *
 * Response shape mirrors server/src/services/pricingService.ts MioraPricingSettings
 * and is consumed by client/src/services/pricingService.ts loadRemotePricing().
 */
@RestController
@RequestMapping("/api")
public class PricingController {

    private static final Logger log = LoggerFactory.getLogger(PricingController.class);

    @Autowired(required = false)
    private Firestore firestore;

    /** Defaults must mirror server/src/services/pricingService.ts DEFAULT_PRICING */
    private static Map<String, Object> buildDefaults() {
        Map<String, Object> defaults = new HashMap<>();
        defaults.put("chatPerMinuteInr", 3);
        defaults.put("audioCallPerMinuteCoins", 20);
        defaults.put("videoCallPerMinuteCoins", 40);
        defaults.put("proPriceInr", 379);
        defaults.put("vipPriceInr", 789);
        defaults.put("gameChargeCoins", 39);
        defaults.put("normalGameChargeCoins", 39);
        defaults.put("interestingGameChargeCoins", 49);
        return defaults;
    }

    @GetMapping("/pricing")
    public ResponseEntity<?> getPricing() {
        Map<String, Object> settings = buildDefaults();

        if (firestore != null) {
            try {
                DocumentSnapshot snap = firestore
                        .collection("app_settings")
                        .document("pricing")
                        .get()
                        .get();

                if (snap.exists()) {
                    Map<String, Object> firestoreData = snap.getData();
                    if (firestoreData != null) {
                        // Merge Firestore values on top of defaults (safe fallback for missing keys)
                        for (String key : settings.keySet()) {
                            Object val = firestoreData.get(key);
                            if (val instanceof Number) {
                                double numVal = ((Number) val).doubleValue();
                                if (numVal >= 0) {
                                    settings.put(key, val);
                                }
                            }
                        }
                        // Pass through metadata fields if present
                        if (firestoreData.containsKey("updatedAt")) settings.put("updatedAt", firestoreData.get("updatedAt"));
                        if (firestoreData.containsKey("updatedBy")) settings.put("updatedBy", firestoreData.get("updatedBy"));
                    }
                }
            } catch (Exception e) {
                log.warn("Could not load pricing from Firestore, using defaults: {}", e.getMessage());
            }
        }

        // Return as a flat JSON object (not wrapped in ApiResponse) to match the Node server
        // and the client's fetch: response.json() as RemotePricingSettings
        return ResponseEntity.ok(settings);
    }
}
