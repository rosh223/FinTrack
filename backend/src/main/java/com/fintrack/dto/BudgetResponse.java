package com.fintrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BudgetResponse {
    private Long id;
    private BigDecimal amount;
    private int month;
    private int year;
    private BigDecimal totalSpending;
    private BigDecimal remainingBudget;
    private double usagePercentage;
}
