package com.miora.controller.admin;

import com.google.firebase.auth.FirebaseAuth;
import com.miora.dto.admin.*;
import com.miora.model.AdminAuditLog;
import com.miora.model.SafetyReport;
import com.miora.model.User;
import com.miora.security.SecurityUtils;
import com.miora.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final FirestoreService firestoreService;

    @Autowired(required = false)
    private FirebaseAuth firebaseAuth;

    // ----- Dashboard -----
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboard() {
        List<User> users = firestoreService.getAllUsers();
        long totalUsers = users.size();
        long bannedUsers = users.stream().filter(u -> Boolean.TRUE.equals(u.getBanned()) || "BANNED".equals(u.getStatus())).count();
        long suspendedUsers = users.stream().filter(u -> Boolean.TRUE.equals(u.getSuspended()) || "SUSPENDED".equals(u.getStatus())).count();
        long activeUsers = users.stream().filter(u -> !"SUSPENDED".equals(u.getStatus()) && !"BANNED".equals(u.getStatus()) && !"DELETED".equals(u.getStatus()) && !Boolean.TRUE.equals(u.getDeleted())).count();
        
        long totalMatches = firestoreService.getMatches().size();
        List<SafetyReport> reports = firestoreService.getAllReports();
        long totalReports = reports.size();
        long pendingReports = reports.stream()
                .filter(r -> r.getStatus() == com.miora.model.ReportStatus.PENDING)
                .count();
        long premiumUsers = users.stream()
                .filter(u -> Boolean.TRUE.equals(u.getIsPremium()))
                .count();
        long totalTransactions = firestoreService.getTransactions(null).size();
        long totalTransactionAmount = firestoreService.getTransactions(null).stream()
                .mapToLong(t -> t.getAmount() != null ? t.getAmount() : 0L)
                .sum();

        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalUsers(totalUsers);
        dto.setActiveUsers(activeUsers);
        dto.setNewUsersLast7Days(0L);
        dto.setTotalMatches(totalMatches);
        dto.setTotalReports(totalReports);
        dto.setPendingReports(pendingReports);
        dto.setSuspendedUsers(suspendedUsers);
        dto.setBannedUsers(bannedUsers);
        dto.setPremiumUsers(premiumUsers);
        dto.setTotalTransactions(totalTransactions);
        dto.setTotalTransactionAmount(totalTransactionAmount);
        return ResponseEntity.ok(dto);
    }

    // ----- Users -----
    @GetMapping("/users")
    public ResponseEntity<PagedResponseDTO<UserSummaryDTO>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        List<User> all = firestoreService.getAllUsers();
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase().trim();
            all = all.stream().filter(u -> 
                (u.getName() != null && u.getName().toLowerCase().contains(q)) ||
                (u.getEmail() != null && u.getEmail().toLowerCase().contains(q)) ||
                (u.getId() != null && u.getId().toLowerCase().contains(q))
            ).collect(Collectors.toList());
        }

        int total = all.size();
        int from = Math.min(page * size, total);
        int to = Math.min(from + size, total);
        List<UserSummaryDTO> items = all.subList(from, to).stream()
                .map(u -> UserSummaryDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .suspended(Boolean.TRUE.equals(u.getSuspended()) || "SUSPENDED".equals(u.getStatus()))
                        .banned(Boolean.TRUE.equals(u.getBanned()) || "BANNED".equals(u.getStatus()))
                        .deleted(Boolean.TRUE.equals(u.getDeleted()) || "DELETED".equals(u.getStatus()))
                        .premium(Boolean.TRUE.equals(u.getIsPremium()))
                        .status(u.getStatus() != null ? u.getStatus() : "ACTIVE")
                        .warned(u.getWarned())
                        .warningReason(u.getWarningReason())
                        .build())
                .collect(Collectors.toList());

        PagedResponseDTO<UserSummaryDTO> resp = new PagedResponseDTO<>();
        resp.setItems(items);
        resp.setTotal(total);
        resp.setPage(page);
        resp.setSize(size);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/users/{uid}")
    public ResponseEntity<User> getUser(@PathVariable String uid) {
        User u = firestoreService.getUser(uid);
        if (u == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(u);
    }

    @PostMapping("/users/{uid}/warn")
    public ResponseEntity<Void> warnUser(@PathVariable String uid, @RequestParam(defaultValue = "Violation of community guidelines") String reason) {
        String adminUid = SecurityUtils.getCurrentUserId();
        firestoreService.setUserWarned(uid, true, reason);
        firestoreService.saveAdminAuditLog(adminUid, "USER_WARNED", uid, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{uid}/suspend")
    public ResponseEntity<Void> suspendUser(@PathVariable String uid, @RequestParam(defaultValue = "true") boolean suspend, @RequestParam(required = false) String reason) {
        String adminUid = SecurityUtils.getCurrentUserId();
        firestoreService.setUserSuspended(uid, suspend);
        String action = suspend ? "USER_SUSPENDED" : "USER_UNSUSPENDED";
        firestoreService.saveAdminAuditLog(adminUid, action, uid, reason != null ? reason : (suspend ? "Account suspended by admin" : "Account unsuspended by admin"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{uid}/ban")
    public ResponseEntity<Void> banUser(@PathVariable String uid, @RequestParam(defaultValue = "true") boolean ban, @RequestParam(required = false) String reason) {
        String adminUid = SecurityUtils.getCurrentUserId();
        firestoreService.setUserBanned(uid, ban);
        String action = ban ? "USER_BANNED" : "USER_UNBANNED";
        firestoreService.saveAdminAuditLog(adminUid, action, uid, reason != null ? reason : (ban ? "Account banned by admin" : "Account unbanned by admin"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{uid}/delete")
    public ResponseEntity<Void> deleteUser(@PathVariable String uid) {
        String adminUid = SecurityUtils.getCurrentUserId();
        firestoreService.softDeleteUser(uid);
        firestoreService.saveAdminAuditLog(adminUid, "USER_DELETED", uid, "Account deleted by admin");
        return ResponseEntity.ok().build();
    }

    // ----- Reports -----
    @GetMapping("/reports")
    public ResponseEntity<PagedResponseDTO<SafetyReport>> listReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<SafetyReport> all = firestoreService.getAllReports();
        int total = all.size();
        int from = Math.min(page * size, total);
        int to = Math.min(from + size, total);
        List<SafetyReport> items = all.subList(from, to);
        PagedResponseDTO<SafetyReport> resp = new PagedResponseDTO<>();
        resp.setItems(items);
        resp.setTotal(total);
        resp.setPage(page);
        resp.setSize(size);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<Void> resolveReport(@PathVariable String id, @RequestBody ReportResolutionDTO resolution) {
        SafetyReport report = firestoreService.getAllReports().stream()
                .filter(r -> id.equals(r.getId()))
                .findFirst()
                .orElse(null);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        String adminUid = SecurityUtils.getCurrentUserId();
        report.setStatus(resolution.getStatus());
        report.setResolvedAt(Instant.now().toString());
        report.setResolvedByAdminUid(adminUid);
        report.setModerationAction(resolution.getModerationAction());
        report.setResolutionNote(resolution.getResolutionNote());
        firestoreService.updateReport(report);

        // Perform moderation action if requested
        if (resolution.getModerationAction() != null) {
            String act = resolution.getModerationAction().name();
            String targetUid = report.getTargetProfileId();
            if ("SUSPEND_USER".equals(act)) {
                firestoreService.setUserSuspended(targetUid, true);
                firestoreService.saveAdminAuditLog(adminUid, "USER_SUSPENDED", targetUid, "Report resolution: " + resolution.getResolutionNote());
            } else if ("BAN_USER".equals(act)) {
                firestoreService.setUserBanned(targetUid, true);
                firestoreService.saveAdminAuditLog(adminUid, "USER_BANNED", targetUid, "Report resolution: " + resolution.getResolutionNote());
            } else if ("WARN_USER".equals(act)) {
                firestoreService.setUserWarned(targetUid, true, resolution.getResolutionNote());
                firestoreService.saveAdminAuditLog(adminUid, "USER_WARNED", targetUid, "Report resolution: " + resolution.getResolutionNote());
            }
        }

        firestoreService.saveAdminAuditLog(adminUid, "REPORT_" + resolution.getStatus().name(), report.getTargetProfileId(), "Report ID: " + id + ", Action: " + resolution.getModerationAction());
        return ResponseEntity.ok().build();
    }

    // ----- Payments / Transactions -----
    @GetMapping("/payments")
    public ResponseEntity<TransactionStatsDTO> getTransactionSummary() {
        List<com.miora.model.CoinTransaction> txs = firestoreService.getTransactions(null);
        long total = txs.size();
        long amount = txs.stream()
                .mapToLong(t -> t.getAmount() != null ? t.getAmount() : 0L)
                .sum();
        TransactionStatsDTO dto = new TransactionStatsDTO();
        dto.setTotalTransactions(total);
        dto.setTotalAmount(amount);
        return ResponseEntity.ok(dto);
    }

    // ----- Audit Logs -----
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AdminAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(firestoreService.getAdminAuditLogs());
    }
}


