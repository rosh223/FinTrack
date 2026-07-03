package com.fintrack.service;

import com.fintrack.dto.CategorySpendingDto;
import com.fintrack.entity.Expense;
import com.fintrack.entity.User;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.repository.ExpenseRepository;
import com.fintrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public List<CategorySpendingDto> getCategoryWiseSpending(int month, int year, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());
        
        // Filter by month and year
        List<Expense> filteredExpenses = expenses.stream()
                .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
                .toList();

        BigDecimal totalSpending = filteredExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> spendingByCategory = filteredExpenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().getName(),
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        return spendingByCategory.entrySet().stream()
                .map(entry -> {
                    double percentage = 0;
                    if (totalSpending.compareTo(BigDecimal.ZERO) > 0) {
                        percentage = entry.getValue().divide(totalSpending, 4, RoundingMode.HALF_UP).doubleValue() * 100;
                    }
                    return CategorySpendingDto.builder()
                            .categoryName(entry.getKey())
                            .totalAmount(entry.getValue())
                            .percentage(percentage)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
