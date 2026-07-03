document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    loadSidebar('budget');
    
    // Set current month and year
    const now = new Date();
    document.getElementById('budgetMonth').value = now.getMonth() + 1;
    document.getElementById('budgetYear').value = now.getFullYear();

    await loadBudget();

    document.getElementById('budgetMonth').addEventListener('change', loadBudget);
    document.getElementById('budgetYear').addEventListener('change', loadBudget);

    document.getElementById('budgetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveBudget();
    });
});

async function loadBudget() {
    const month = document.getElementById('budgetMonth').value;
    const year = document.getElementById('budgetYear').value;

    try {
        const data = await apiFetch(`/budgets/${year}/${month}`);
        
        if (data.amount > 0) {
            document.getElementById('budgetAmount').value = data.amount;
        } else {
            document.getElementById('budgetAmount').value = '';
        }

        document.getElementById('currentBudgetAmount').textContent = formatCurrency(data.amount);
        document.getElementById('totalSpending').textContent = formatCurrency(data.totalSpending);
        
        const remainingElem = document.getElementById('remainingBudget');
        remainingElem.textContent = formatCurrency(data.remainingBudget);
        remainingElem.style.color = data.remainingBudget < 0 ? 'var(--danger-color)' : 'var(--success-color)';

        const usageElem = document.getElementById('usagePercentage');
        usageElem.textContent = `${data.usagePercentage.toFixed(2)}%`;
        if (data.usagePercentage > 100) {
            usageElem.style.color = 'var(--danger-color)';
        } else if (data.usagePercentage > 80) {
            usageElem.style.color = 'orange';
        } else {
            usageElem.style.color = 'var(--success-color)';
        }

    } catch (error) {
        console.error('Failed to load budget', error);
    }
}

async function saveBudget() {
    const month = parseInt(document.getElementById('budgetMonth').value);
    const year = parseInt(document.getElementById('budgetYear').value);
    const amount = parseFloat(document.getElementById('budgetAmount').value);

    const errorDiv = document.getElementById('formError');
    const successDiv = document.getElementById('formSuccess');
    errorDiv.textContent = '';
    successDiv.textContent = '';

    try {
        await apiFetch('/budgets', {
            method: 'POST',
            body: JSON.stringify({ amount, month, year })
        });
        successDiv.textContent = 'Budget updated successfully!';
        setTimeout(() => successDiv.textContent = '', 3000);
        await loadBudget();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}
