package com.fintrack.service;

import com.fintrack.dto.BudgetResponse;
import com.fintrack.dto.DashboardResponse;
import com.fintrack.dto.TransactionDto;
import com.fintrack.entity.Income;
import com.fintrack.entity.Expense;
import com.fintrack.entity.User;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.repository.ExpenseRepository;
import com.fintrack.repository.IncomeRepository;
import com.fintrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final BudgetService budgetService;

    public DashboardResponse getDashboardData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long userId = user.getId();
        BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserId(userId);
        BigDecimal totalExpense = expenseRepository.getTotalSpendingByUserId(userId);
        BigDecimal remainingBalance = totalIncome.subtract(totalExpense);

        LocalDate now = LocalDate.now();
        BudgetResponse currentMonthBudget = budgetService.getBudget(now.getMonthValue(), now.getYear(), email);

        List<Income> incomes = incomeRepository.findByUserIdOrderByDateDesc(userId);
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(userId);

        List<TransactionDto> transactions = new ArrayList<>();
        
        incomes.forEach(income -> {
            transactions.add(TransactionDto.builder()
                    .id(income.getId())
                    .title(income.getSource())
                    .amount(income.getAmount())
                    .date(income.getDate())
                    .type("INCOME")
                    .build());
        });

        expenses.forEach(expense -> {
            transactions.add(TransactionDto.builder()
                    .id(expense.getId())
                    .title(expense.getTitle())
                    .amount(expense.getAmount())
                    .date(expense.getDate())
                    .type("EXPENSE")
                    .build());
        });

        // Sort by date desc and take top 5
        List<TransactionDto> recentTransactions = transactions.stream()
                .sorted(Comparator.comparing(TransactionDto::getDate).reversed())
                .limit(5)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpense)
                .remainingBalance(remainingBalance)
                .currentMonthBudget(currentMonthBudget)
                .recentTransactions(recentTransactions)
                .build();
    }
}
