package com.fintrack.repository;

import com.fintrack.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND EXTRACT(month FROM e.date) = :month AND EXTRACT(year FROM e.date) = :year")
    java.math.BigDecimal getTotalSpendingByMonthAndYear(Long userId, int month, int year);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    java.math.BigDecimal getTotalSpendingByUserId(Long userId);
}
