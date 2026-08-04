let incomes = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    loadSidebar('income');
    await loadIncomes();

    // Set date constraints on the date input
    const dateInput = document.getElementById('incomeDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
    dateInput.setAttribute('min', '2000-01-01');

    document.getElementById('showAddFormBtn').addEventListener('click', () => {
        resetForm();
        // Default the date to today when adding new income
        document.getElementById('incomeDate').value = today;
        document.getElementById('incomeFormCard').style.display = 'block';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('incomeFormCard').style.display = 'none';
        resetForm();
    });

    document.getElementById('incomeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveIncome();
    });
});

async function loadIncomes() {
    try {
        incomes = await apiFetch('/incomes');
        renderTable();
    } catch (error) {
        document.getElementById('incomeTable').innerHTML = '<tr><td colspan="5" class="text-center error-msg">Failed to load data.</td></tr>';
    }
}

function renderTable() {
    const tbody = document.getElementById('incomeTable');
    tbody.innerHTML = '';

    if (incomes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No income records found.</td></tr>';
        return;
    }

    incomes.forEach(income => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${income.date}</td>
            <td>${income.source}</td>
            <td style="color: var(--success-color); font-weight: bold;">${formatCurrency(income.amount)}</td>
            <td>${income.description || '-'}</td>
            <td>
                <button class="btn" style="width: auto; padding: 5px 10px; font-size: 12px;" onclick="editIncome(${income.id})">Edit</button>
                <button class="btn btn-danger" style="width: auto; padding: 5px 10px; font-size: 12px;" onclick="deleteIncome(${income.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveIncome() {
    const id = document.getElementById('incomeId').value;
    const payload = {
        source: document.getElementById('incomeSource').value,
        amount: parseFloat(document.getElementById('incomeAmount').value),
        date: document.getElementById('incomeDate').value,
        description: document.getElementById('incomeDesc').value
    };

    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = '';

    // Validate the date is reasonable
    const incomeDate = new Date(payload.date);
    const now = new Date();
    if (isNaN(incomeDate.getTime())) {
        errorDiv.textContent = 'Please enter a valid date.';
        return;
    }
    if (incomeDate.getFullYear() < 2000 || incomeDate > now) {
        errorDiv.textContent = 'Date must be between year 2000 and today.';
        return;
    }

    try {
        if (id) {
            await apiFetch(`/incomes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await apiFetch('/incomes', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
        document.getElementById('incomeFormCard').style.display = 'none';
        await loadIncomes();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

function editIncome(id) {
    const income = incomes.find(i => i.id === id);
    if (!income) return;

    document.getElementById('formTitle').textContent = 'Edit Income';
    document.getElementById('incomeId').value = income.id;
    document.getElementById('incomeSource').value = income.source;
    document.getElementById('incomeAmount').value = income.amount;
    document.getElementById('incomeDate').value = income.date;
    document.getElementById('incomeDesc').value = income.description;
    
    document.getElementById('incomeFormCard').style.display = 'block';
    window.scrollTo(0, 0);
}

async function deleteIncome(id) {
    if (!confirm('Are you sure you want to delete this income record?')) return;

    try {
        await apiFetch(`/incomes/${id}`, { method: 'DELETE' });
        await loadIncomes();
    } catch (error) {
        alert('Failed to delete income: ' + error.message);
    }
}

function resetForm() {
    document.getElementById('formTitle').textContent = 'Add New Income';
    document.getElementById('incomeForm').reset();
    document.getElementById('incomeId').value = '';
    document.getElementById('formError').textContent = '';
}
