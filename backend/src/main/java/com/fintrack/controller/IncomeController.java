package com.fintrack.controller;

import com.fintrack.dto.IncomeRequest;
import com.fintrack.dto.IncomeResponse;
import com.fintrack.service.IncomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incomes")
@RequiredArgsConstructor
@Tag(name = "Income", description = "Endpoints for income management")
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    @Operation(summary = "Add a new income")
    public ResponseEntity<IncomeResponse> addIncome(@Valid @RequestBody IncomeRequest request, Authentication authentication) {
        return new ResponseEntity<>(incomeService.addIncome(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all incomes for current user")
    public ResponseEntity<List<IncomeResponse>> getAllIncomes(Authentication authentication) {
        return ResponseEntity.ok(incomeService.getAllIncomes(authentication.getName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an income")
    public ResponseEntity<IncomeResponse> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(incomeService.updateIncome(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an income")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id, Authentication authentication) {
        incomeService.deleteIncome(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
