package com.miora.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long activeUsers;
    private long newUsersLast7Days;
    private long totalMatches;
    private long totalReports;
    private long pendingReports;
    private long suspendedUsers;
    private long bannedUsers;
    private long premiumUsers;
    private long totalTransactions;
    private long totalTransactionAmount;
    private List<TrendDTO> userTrend;
    private List<TrendDTO> matchTrend;
    private List<TrendDTO> reportTrend;
    private List<TrendDTO> transactionTrend;
}
