package com.miora.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO used by AdminController to return a summary of transaction statistics.
 * It contains only the fields that AdminController populates:
 *   - totalTransactions
 *   - totalAmount
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatsDTO {
    private long totalTransactions;
    private long totalAmount;
}
