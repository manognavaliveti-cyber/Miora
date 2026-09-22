package com.miora.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Simple DTO representing a time‑series trend entry for the admin dashboard.
 * The {@code label} can be a date (e.g. "2024‑09‑01") or any categorical bucket.
 * The {@code count} is the numeric value for that bucket.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendDTO {
    private String label;
    private long count;
}
