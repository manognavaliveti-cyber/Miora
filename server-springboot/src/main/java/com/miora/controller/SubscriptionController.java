package com.miora.controller;

import com.miora.dto.ApiResponse;
import com.miora.model.User;
import com.miora.security.SecurityUtils;
import com.miora.service.FirestoreService;
import com.miora.service.RazorpayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private FirestoreService firestoreService;

    @Autowired
    private RazorpayService razorpayService;

    @GetMapping("/subscription/offer-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOfferStatus() {
        boolean isWeekend = razorpayService.isWeekendInKolkata();
        RazorpayService.CoinPackage proPkg = razorpayService.getPackage("pro");
        RazorpayService.CoinPackage vipPkg = razorpayService.getPackage("vip");

        Map<String, Object> data = new HashMap<>();
        data.put("isWeekend", isWeekend);
        data.put("proPriceInr", proPkg.getPriceInr());
        data.put("proRegularPriceInr", proPkg.getRegularPriceInr());
        data.put("proWalletCreditInr", proPkg.getWalletCreditInr());
        data.put("proBonusInr", proPkg.getBonusInr());

        data.put("vipPriceInr", vipPkg.getPriceInr());
        data.put("vipRegularPriceInr", vipPkg.getRegularPriceInr());
        data.put("vipWalletCreditInr", vipPkg.getWalletCreditInr());
        data.put("vipBonusInr", vipPkg.getBonusInr());

        return ResponseEntity.ok(ApiResponse.ok("Subscription offer status retrieved", data));
    }

    @PostMapping("/subscription/subscribe")
    public ResponseEntity<ApiResponse<User>> subscribe(@RequestBody(required = false) Map<String, String> payload) {
        String userId = SecurityUtils.getCurrentUserId();
        User user = firestoreService.getUser(userId);
        if (user != null && Boolean.TRUE.equals(user.getIsPremium())) {
            return ResponseEntity.ok(ApiResponse.ok("User already has active MIORA Premium", user));
        }
        // SECURITY HARDENING: Direct subscription unlock without verified Razorpay payment is BLOCKED.
        return ResponseEntity.status(402).body(ApiResponse.error("Direct subscription activation prohibited. Complete payment via Razorpay to activate MIORA PRO or VIP."));
    }

    @PostMapping("/powerups/boost")
    public ResponseEntity<ApiResponse<User>> activateBoost() {
        String userId = SecurityUtils.getCurrentUserId();
        User updated = firestoreService.boostUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("30-minute Boost activated", updated));
    }

    @PostMapping("/powerups/spotlight")
    public ResponseEntity<ApiResponse<User>> activateSpotlight() {
        String userId = SecurityUtils.getCurrentUserId();
        User updated = firestoreService.spotlightUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("24-hour Spotlight activated", updated));
    }

    @GetMapping("/likes/who-liked-me")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWhoLikedMe() {
        String userId = SecurityUtils.getCurrentUserId();
        User user = firestoreService.getUser(userId);
        boolean isPremium = user != null && Boolean.TRUE.equals(user.getIsPremium());

        List<Map<String, Object>> admirers = firestoreService.getWhoLikedMe(userId);
        if (!isPremium && admirers != null) {
            // SECURITY ENFORCEMENT: Blur/anonymize profiles for non-premium users on backend
            for (Map<String, Object> item : admirers) {
                Object profileObj = item.get("profile");
                if (profileObj instanceof com.miora.model.Profile p) {
                    com.miora.model.Profile blurred = com.miora.model.Profile.builder()
                            .id(p.getId())
                            .name("MIORA Member")
                            .age(p.getAge())
                            .location("Nearby")
                            .bio("✨ Upgrade to PRO or VIP to view full profile details and photos.")
                            .photos(List.of("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=30"))
                            .compatibility(p.getCompatibility())
                            .verified(false)
                            .build();
                    item.put("profile", blurred);
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Fetched admirers successfully", admirers));
    }
}
