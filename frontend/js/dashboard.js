document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    loadSidebar('dashboard');
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        const data = await apiFetch('/dashboard');
        
        document.getElementById('totalIncome').textContent = formatCurrency(data.totalIncome);
        document.getElementById('totalExpenses').textContent = formatCurrency(data.totalExpenses);
        document.getElementById('remainingBalance').textContent = formatCurrency(data.remainingBalance);
        
        if (data.currentMonthBudget) {
            document.getElementById('budgetUsage').textContent = `${data.currentMonthBudget.usagePercentage.toFixed(2)}%`;
        } else {
            document.getElementById('budgetUsage').textContent = 'N/A';
        }

        const tbody = document.getElementById('recentTransactionsTable');
        tbody.innerHTML = '';

        if (data.recentTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No transactions found.</td></tr>';
            return;
        }

        data.recentTransactions.forEach(tx => {
            const tr = document.createElement('tr');
            const isIncome = tx.type === 'INCOME';
            const amountColor = isIncome ? 'var(--success-color)' : 'var(--danger-color)';
            
            tr.innerHTML = `
                <td>${tx.date}</td>
                <td>${tx.title}</td>
                <td>${tx.type}</td>
                <td style="color: ${amountColor}; font-weight: bold;">
                    ${isIncome ? '+' : '-'}${formatCurrency(tx.amount)}
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Failed to load dashboard:', error);
        document.getElementById('recentTransactionsTable').innerHTML = 
            '<tr><td colspan="4" class="text-center error-msg">Failed to load data.</td></tr>';
    }
}
