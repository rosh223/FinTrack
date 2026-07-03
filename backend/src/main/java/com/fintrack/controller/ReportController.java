package com.fintrack.controller;

import com.fintrack.dto.CategorySpendingDto;
import com.fintrack.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Endpoints for generating reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/category-spending/{year}/{month}")
    @Operation(summary = "Get category-wise spending for a specific month")
    public ResponseEntity<List<CategorySpendingDto>> getCategorySpending(
            @PathVariable int year,
            @PathVariable int month,
            Authentication authentication) {
        return ResponseEntity.ok(reportService.getCategoryWiseSpending(month, year, authentication.getName()));
    }
}
