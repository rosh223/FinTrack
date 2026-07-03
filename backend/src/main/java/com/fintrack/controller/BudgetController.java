package com.fintrack.controller;

import com.fintrack.dto.BudgetRequest;
import com.fintrack.dto.BudgetResponse;
import com.fintrack.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budget", description = "Endpoints for budget management")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @Operation(summary = "Set or update monthly budget")
    public ResponseEntity<BudgetResponse> setBudget(@Valid @RequestBody BudgetRequest request, Authentication authentication) {
        return ResponseEntity.ok(budgetService.setBudget(request, authentication.getName()));
    }

    @GetMapping("/{year}/{month}")
    @Operation(summary = "Get budget summary for a specific month and year")
    public ResponseEntity<BudgetResponse> getBudget(
            @PathVariable int year,
            @PathVariable int month,
            Authentication authentication) {
        return ResponseEntity.ok(budgetService.getBudget(month, year, authentication.getName()));
    }
}
