document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    loadSidebar('reports');
    
    // Set current month and year
    const now = new Date();
    document.getElementById('reportMonth').value = now.getMonth() + 1;
    document.getElementById('reportYear').value = now.getFullYear();

    await loadReport();

    document.getElementById('reportMonth').addEventListener('change', loadReport);
    document.getElementById('reportYear').addEventListener('change', loadReport);
});

async function loadReport() {
    const month = document.getElementById('reportMonth').value;
    const year = document.getElementById('reportYear').value;

    try {
        const data = await apiFetch(`/reports/category-spending/${year}/${month}`);
        renderTable(data);
    } catch (error) {
        console.error('Failed to load report', error);
        document.getElementById('reportTable').innerHTML = '<tr><td colspan="3" class="text-center error-msg">Failed to load data.</td></tr>';
    }
}

function renderTable(data) {
    const tbody = document.getElementById('reportTable');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">No spending data for this month.</td></tr>';
        return;
    }

    // Sort by amount desc
    data.sort((a, b) => b.totalAmount - a.totalAmount);

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.categoryName}</td>
            <td style="color: var(--danger-color); font-weight: bold;">${formatCurrency(item.totalAmount)}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; background: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="width: ${item.percentage}%; background: var(--primary-color); height: 100%;"></div>
                    </div>
                    <span>${item.percentage.toFixed(1)}%</span>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
