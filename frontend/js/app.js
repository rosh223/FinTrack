// Automatically use local backend for testing, and Render backend for production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8080/api/v1' 
    : 'https://YOUR_BACKEND_NAME.onrender.com/api/v1'; // You will update this after deploying the backend!

// JWT Token Management
function setToken(token) {
    localStorage.setItem('fintrack_token', token);
}

function getToken() {
    return localStorage.getItem('fintrack_token');
}

function removeToken() {
    localStorage.removeItem('fintrack_token');
}

function isAuthenticated() {
    return !!getToken();
}

function logout() {
    removeToken();
    window.location.href = 'index.html';
}

// Fetch Wrapper with Authorization
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Unauthorized');
        }

        if (response.status === 204) {
            return null; // No content
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API Error');
        }

        return data;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

// Load sidebar dynamically for protected pages
function loadSidebar(activePage) {
    const sidebarHtml = `
        <div class="sidebar">
            <h2>FinTrack</h2>
            <ul class="nav-menu">
                <li><a href="dashboard.html" id="nav-dashboard">Dashboard</a></li>
                <li><a href="income.html" id="nav-income">Income</a></li>
                <li><a href="expense.html" id="nav-expense">Expenses</a></li>
                <li><a href="budget.html" id="nav-budget">Budget</a></li>
                <li><a href="category.html" id="nav-category">Categories</a></li>
                <li><a href="reports.html" id="nav-reports">Reports</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </div>
    `;

    const layout = document.querySelector('.layout');
    if (layout) {
        layout.insertAdjacentHTML('afterbegin', sidebarHtml);
        const activeLink = document.getElementById(`nav-${activePage}`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
