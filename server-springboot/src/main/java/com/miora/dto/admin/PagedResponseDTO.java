package com.miora.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic wrapper for paginated responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponseDTO<T> {
    private List<T> items;
    private long total;
    private int page; // zero‑based page number
    private int size; // page size
}
