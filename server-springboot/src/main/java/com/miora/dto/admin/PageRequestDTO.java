package com.miora.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Simple DTO to capture pagination parameters from the client.
 * page: zero‑based page index
 * size: number of items per page (allowed values 20, 50, 100)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequestDTO {
    private int page = 0; // default first page
    private int size = 20; // default page size
}
