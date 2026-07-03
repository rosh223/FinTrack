package com.fintrack.service;

import com.fintrack.dto.BudgetRequest;
import com.fintrack.dto.BudgetResponse;
import com.fintrack.entity.Budget;
import com.fintrack.entity.User;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.repository.BudgetRepository;
import com.fintrack.repository.ExpenseRepository;
import com.fintrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetResponse setBudget(BudgetRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), request.getMonth(), request.getYear())
                .orElse(Budget.builder()
                        .user(user)
                        .month(request.getMonth())
                        .year(request.getYear())
                        .build());

        budget.setAmount(request.getAmount());
        budget = budgetRepository.save(budget);

        return getBudgetSummary(budget, user.getId());
    }

    public BudgetResponse getBudget(int month, int year, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(user.getId(), month, year)
                .orElse(null);

        if (budget == null) {
            return BudgetResponse.builder()
                    .amount(BigDecimal.ZERO)
                    .month(month)
                    .year(year)
                    .totalSpending(expenseRepository.getTotalSpendingByMonthAndYear(user.getId(), month, year))
                    .remainingBudget(BigDecimal.ZERO)
                    .usagePercentage(0)
                    .build();
        }

        return getBudgetSummary(budget, user.getId());
    }

    private BudgetResponse getBudgetSummary(Budget budget, Long userId) {
        BigDecimal totalSpending = expenseRepository.getTotalSpendingByMonthAndYear(userId, budget.getMonth(), budget.getYear());
        BigDecimal remainingBudget = budget.getAmount().subtract(totalSpending);
        
        double usagePercentage = 0.0;
        if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            usagePercentage = totalSpending.divide(budget.getAmount(), 4, RoundingMode.HALF_UP).doubleValue() * 100;
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .amount(budget.getAmount())
                .month(budget.getMonth())
                .year(budget.getYear())
                .totalSpending(totalSpending)
                .remainingBudget(remainingBudget)
                .usagePercentage(usagePercentage)
                .build();
    }
}
