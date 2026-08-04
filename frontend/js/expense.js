let expenses = [];
let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    loadSidebar('expense');
    await loadCategories();
    await loadExpenses();

    // Set date constraints on the date input
    const dateInput = document.getElementById('expenseDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
    dateInput.setAttribute('min', '2000-01-01');

    document.getElementById('showAddFormBtn').addEventListener('click', () => {
        resetForm();
        // Default the date to today when adding a new expense
        document.getElementById('expenseDate').value = today;
        document.getElementById('expenseFormCard').style.display = 'block';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('expenseFormCard').style.display = 'none';
        resetForm();
    });

    document.getElementById('expenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveExpense();
    });
});

async function loadCategories() {
    try {
        categories = await apiFetch('/categories');
        const select = document.getElementById('expenseCategory');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load categories', error);
    }
}

async function loadExpenses() {
    try {
        expenses = await apiFetch('/expenses');
        renderTable();
    } catch (error) {
        document.getElementById('expenseTable').innerHTML = '<tr><td colspan="5" class="text-center error-msg">Failed to load data.</td></tr>';
    }
}

function renderTable() {
    const tbody = document.getElementById('expenseTable');
    tbody.innerHTML = '';

    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No expense records found.</td></tr>';
        return;
    }

    expenses.forEach(expense => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.title}</td>
            <td>${expense.category.name}</td>
            <td style="color: var(--danger-color); font-weight: bold;">${formatCurrency(expense.amount)}</td>
            <td>
                <button class="btn" style="width: auto; padding: 5px 10px; font-size: 12px;" onclick="editExpense(${expense.id})">Edit</button>
                <button class="btn btn-danger" style="width: auto; padding: 5px 10px; font-size: 12px;" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveExpense() {
    const id = document.getElementById('expenseId').value;
    const payload = {
        title: document.getElementById('expenseTitle').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        date: document.getElementById('expenseDate').value,
        categoryId: parseInt(document.getElementById('expenseCategory').value),
        description: document.getElementById('expenseDesc').value
    };

    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = '';

    // Validate the date is reasonable
    const expenseDate = new Date(payload.date);
    const now = new Date();
    if (isNaN(expenseDate.getTime())) {
        errorDiv.textContent = 'Please enter a valid date.';
        return;
    }
    if (expenseDate.getFullYear() < 2000 || expenseDate > now) {
        errorDiv.textContent = 'Date must be between year 2000 and today.';
        return;
    }

    try {
        if (id) {
            await apiFetch(`/expenses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await apiFetch('/expenses', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        document.getElementById('expenseFormCard').style.display = 'none';
        await loadExpenses();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    document.getElementById('formTitle').textContent = 'Edit Expense';
    document.getElementById('expenseId').value = expense.id;
    document.getElementById('expenseTitle').value = expense.title;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('expenseCategory').value = expense.category.id;
    document.getElementById('expenseDesc').value = expense.description;
    
    document.getElementById('expenseFormCard').style.display = 'block';
    window.scrollTo(0, 0);
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense record?')) return;

    try {
        await apiFetch(`/expenses/${id}`, { method: 'DELETE' });
        await loadExpenses();
    } catch (error) {
        alert('Failed to delete expense: ' + error.message);
    }
}

function resetForm() {
    document.getElementById('formTitle').textContent = 'Add New Expense';
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('formError').textContent = '';
}
