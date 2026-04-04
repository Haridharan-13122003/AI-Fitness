// Generic API base URL
const API_URL = 'http://localhost:3000/api';

// Check if user is logged in
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const loginBtn = document.getElementById('nav-login-btn');
    const registerBtn = document.getElementById('nav-register-btn');
    const dashBtn = document.getElementById('nav-dash-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');

    if (userId) {
        if(loginBtn) loginBtn.style.display = 'none';
        if(registerBtn) registerBtn.style.display = 'none';
        if(dashBtn) dashBtn.style.display = 'inline-block';
        if(logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if(loginBtn) loginBtn.style.display = 'inline-block';
        if(registerBtn) registerBtn.style.display = 'inline-block';
        if(dashBtn) dashBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'none';
        
        // Protect routes that require auth
        const path = window.location.pathname;
        const protectedRoutes = ['dashboard.html', 'workout.html', 'bmi.html', 'diet.html', 'progress.html', 'chatbot.html'];
        const isProtected = protectedRoutes.some(route => path.includes(route));
        
        if (isProtected) {
            window.location.href = 'login.html';
        }
    }
}

// Global Logout function
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Show Alert Messages in UI
function showMessage(elementId, msg, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = msg;
    el.className = `message ${type}`;
    setTimeout(() => {
        el.style.display = 'none';
        el.className = 'message';
    }, 4000);
}

// Call checkAuth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
