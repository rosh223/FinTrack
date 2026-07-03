let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    loadSidebar('category');
    await loadCategories();

    document.getElementById('showAddFormBtn').addEventListener('click', () => {
        document.getElementById('categoryName').value = '';
        document.getElementById('formError').textContent = '';
        document.getElementById('categoryFormCard').style.display = 'block';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('categoryFormCard').style.display = 'none';
    });

    document.getElementById('categoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveCategory();
    });
});

async function loadCategories() {
    try {
        categories = await apiFetch('/categories');
        renderTable();
    } catch (error) {
        document.getElementById('categoryTable').innerHTML = '<tr><td colspan="2" class="text-center error-msg">Failed to load data.</td></tr>';
    }
}

function renderTable() {
    const tbody = document.getElementById('categoryTable');
    tbody.innerHTML = '';

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center">No categories found.</td></tr>';
        return;
    }

    categories.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat.name}</td>
            <td><span style="padding: 3px 8px; border-radius: 4px; font-size: 12px; background-color: ${cat.default ? '#e0e0e0' : 'var(--primary-color)'}; color: ${cat.default ? '#333' : '#fff'}">${cat.default ? 'Default' : 'Custom'}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveCategory() {
    const name = document.getElementById('categoryName').value;
    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = '';

    try {
        await apiFetch('/categories', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
        document.getElementById('categoryFormCard').style.display = 'none';
        await loadCategories();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}
