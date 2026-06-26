/* ==========================================================================
   Synthworks Dashboard - Premium Application Logic
   ========================================================================== */

/* ===== 1. APP CONFIGURATION ===== */
const CONFIG = {
  appName: 'Synthworks',
  userName: '',
  userRole: 'Founder',
  userEmail: '',
  currency: '$',
  currencyCode: 'USD',
  workspaceId: null,
};

/* ===== 2. DATA STORES (Mock Data for Demo) ===== */
const DASHBOARD_STATS = {
  totalRevenue: 0,
  activeProjects: 0,
  pendingTasks: 0,
  clientSatisfaction: 0
};

const PROJECTS = [];

/* ===== 3. NAVIGATION MENU ===== */
const NAV_MENU = [
  { id: 'dashboard', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'projects', label: 'Projects', icon: 'folder-kanban' },
  { id: 'tasks', label: 'Tasks', icon: 'check-square' },
  { id: 'clients', label: 'Clients', icon: 'building-2' },
  { id: 'finance', label: 'Finance', icon: 'dollar-sign' },
  { id: 'team', label: 'Team', icon: 'users' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

/* ===== 4. DOM ELEMENTS ===== */
const DOM = {
  authScreen: document.getElementById('auth-screen'),
  loginForm: document.getElementById('login-form-container'),
  registerForm: document.getElementById('register-form-container'),
  sidebarNav: document.getElementById('sidebar-nav'),
  mainContent: document.getElementById('main-content'),
  pageTitle: document.getElementById('page-title'),
  toastContainer: document.getElementById('toast-container'),
  userName: document.getElementById('user-name'),
  userRole: document.getElementById('user-role'),
  userAvatar: document.getElementById('user-avatar'),
  appName: document.getElementById('app-name'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
};

let currentPage = 'dashboard';
let chartInstances = {};

/* ===== 5. INITIALIZATION ===== */
function initApp() {
  bindAuthEvents();
  bindUIEvents();
  
  // Check if "logged in" based on localStorage (mock auth state)
  const session = localStorage.getItem('synthworks_session');
  if (session) {
    const user = JSON.parse(session);
    CONFIG.userName = user.name;
    CONFIG.appName = user.workspace;
    CONFIG.userEmail = user.email;
    completeLogin();
  } else {
    DOM.authScreen.classList.remove('hidden');
    DOM.authScreen.style.opacity = '1';
    DOM.authScreen.style.pointerEvents = 'auto';
  }
}

/* ===== 6. AUTHENTICATION LOGIC ===== */
function bindAuthEvents() {
  document.getElementById('btn-show-register')?.addEventListener('click', () => {
    DOM.loginForm.classList.add('hidden');
    DOM.registerForm.classList.remove('hidden');
  });

  document.getElementById('btn-show-login')?.addEventListener('click', () => {
    DOM.registerForm.classList.add('hidden');
    DOM.loginForm.classList.remove('hidden');
  });

  document.getElementById('btn-toggle-login-pw')?.addEventListener('click', function() {
    const input = document.getElementById('login-password');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    this.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="h-5 w-5"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  document.getElementById('btn-login')?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    if (!email || !pass) {
      errorEl.textContent = 'Please enter both email and password.';
      errorEl.classList.remove('hidden');
      return;
    }
    
    // Mock successful login
    errorEl.classList.add('hidden');
    CONFIG.userName = email.split('@')[0] || 'User';
    CONFIG.appName = 'My Workspace';
    CONFIG.userEmail = email;
    
    localStorage.setItem('synthworks_session', JSON.stringify({
      name: CONFIG.userName,
      workspace: CONFIG.appName,
      email: CONFIG.userEmail
    }));
    
    showToast('Welcome back, ' + CONFIG.userName + '!', 'success');
    completeLogin();
  });

  document.getElementById('btn-register')?.addEventListener('click', () => {
    const first = document.getElementById('reg-first').value.trim();
    const workspace = document.getElementById('reg-workspace').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const errorEl = document.getElementById('register-error');
    
    if (!first || !workspace || !email) {
      errorEl.textContent = 'Please fill all required fields.';
      errorEl.classList.remove('hidden');
      return;
    }
    
    // Mock successful registration
    errorEl.classList.add('hidden');
    CONFIG.userName = first;
    CONFIG.appName = workspace;
    CONFIG.userEmail = email;
    
    localStorage.setItem('synthworks_session', JSON.stringify({
      name: CONFIG.userName,
      workspace: CONFIG.appName,
      email: CONFIG.userEmail
    }));
    
    showToast('Workspace created successfully!', 'success');
    completeLogin();
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('synthworks_session');
    
    DOM.authScreen.classList.remove('hidden');
    setTimeout(() => {
      DOM.authScreen.style.opacity = '1';
      DOM.authScreen.style.pointerEvents = 'auto';
    }, 10);
    
    showToast('Signed out.', 'info');
  });
}

function completeLogin() {
  DOM.authScreen.style.opacity = '0';
  DOM.authScreen.style.pointerEvents = 'none';
  setTimeout(() => {
    DOM.authScreen.classList.add('hidden');
  }, 500);
  
  DOM.userName.textContent = CONFIG.userName;
  DOM.appName.textContent = CONFIG.appName;
  DOM.userAvatar.textContent = CONFIG.userName.charAt(0).toUpperCase();
  
  buildSidebar();
  navigate('dashboard');
}

/* ===== 7. UI EVENTS & SIDEBAR ===== */
function bindUIEvents() {
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
    
    // Re-render charts for theme colors
    if (currentPage === 'dashboard') {
      setTimeout(() => renderDashboardCharts(), 100);
    }
  });

  // Mobile Sidebar Toggle
  document.getElementById('btn-open-sidebar')?.addEventListener('click', toggleSidebar);
  document.getElementById('btn-close-sidebar')?.addEventListener('click', toggleSidebar);
  DOM.sidebarOverlay?.addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
  const isOpen = DOM.sidebar.classList.contains('translate-x-0');
  if (isOpen) {
    DOM.sidebar.classList.remove('translate-x-0');
    DOM.sidebar.classList.add('-translate-x-full');
    DOM.sidebarOverlay.classList.add('hidden');
    DOM.sidebarOverlay.style.opacity = '0';
  } else {
    DOM.sidebar.classList.remove('-translate-x-full');
    DOM.sidebar.classList.add('translate-x-0');
    DOM.sidebarOverlay.classList.remove('hidden');
    setTimeout(() => {
      DOM.sidebarOverlay.style.opacity = '1';
    }, 10);
  }
}

function buildSidebar() {
  DOM.sidebarNav.innerHTML = '';
  NAV_MENU.forEach(item => {
    const el = document.createElement('div');
    el.className = `sidebar-item ${item.id === currentPage ? 'active' : ''}`;
    el.innerHTML = `
      <i data-lucide="${item.icon}" class="h-5 w-5"></i>
      <span>${item.label}</span>
    `;
    el.addEventListener('click', () => {
      navigate(item.id);
      if (window.innerWidth < 1024) toggleSidebar();
    });
    DOM.sidebarNav.appendChild(el);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ===== 8. ROUTING & PAGE RENDERING ===== */
function navigate(pageId) {
  currentPage = pageId;
  const pageDef = NAV_MENU.find(m => m.id === pageId);
  DOM.pageTitle.textContent = pageDef ? pageDef.label : 'Dashboard';
  
  // Update sidebar active state
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.remove('active');
    if (el.textContent.trim() === DOM.pageTitle.textContent) {
      el.classList.add('active');
    }
  });

  // Clear charts
  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  DOM.mainContent.innerHTML = `<div class="page-content" id="page-${pageId}"></div>`;
  const pageContainer = document.getElementById(`page-${pageId}`);
  
  if (pageId === 'dashboard') {
    pageContainer.innerHTML = renderDashboardPage();
    renderDashboardCharts();
  } else {
    pageContainer.innerHTML = renderPlaceholderPage(pageId);
  }

  // Trigger animation
  setTimeout(() => {
    pageContainer.classList.add('active');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
}

/* ===== 9. PAGE TEMPLATES ===== */
function renderDashboardPage() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      ${renderStatCard('Total Revenue', '$' + DASHBOARD_STATS.totalRevenue, 'No data yet', 'dollar-sign', 'primary')}
      ${renderStatCard('Active Projects', DASHBOARD_STATS.activeProjects, 'No active projects', 'folder-kanban', 'secondary')}
      ${renderStatCard('Pending Tasks', DASHBOARD_STATS.pendingTasks, 'No pending tasks', 'check-square', 'accent-foreground')}
      ${renderStatCard('Client Satisfaction', DASHBOARD_STATS.clientSatisfaction + '%', 'No feedback yet', 'heart', 'success')}
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="xl:col-span-2 premium-card p-6 glass">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">Revenue Overview</h3>
          <button class="text-sm font-medium text-primary hover:underline">View Report</button>
        </div>
        <div class="h-[300px] w-full relative">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>
      
      <div class="premium-card p-6 glass">
        <h3 class="text-xl font-bold mb-6">Active Projects</h3>
        <div class="space-y-6">
          ${PROJECTS.length > 0 ? PROJECTS.map(p => `
            <div>
              <div class="flex justify-between items-end mb-2">
                <div>
                  <h4 class="font-bold text-foreground">${p.name}</h4>
                  <p class="text-xs text-muted-foreground">${p.client}</p>
                </div>
                <span class="text-sm font-bold text-primary">${p.progress}%</span>
              </div>
              <div class="progress-bg">
                <div class="progress-fill" style="width: ${p.progress}%"></div>
              </div>
            </div>
          `).join('') : '<p class="text-sm text-muted-foreground text-center py-4">No projects yet. Add one to get started!</p>'}
        </div>
        <button class="w-full mt-6 btn-primary py-2.5 rounded-lg text-sm" onclick="navigate('projects')">
          View All Projects
        </button>
      </div>
    </div>
  `;
}

function renderStatCard(title, value, subtitle, icon, colorClass) {
  return `
    <div class="premium-card p-6 glass">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm font-medium text-muted-foreground mb-1">${title}</p>
          <h3 class="text-3xl font-bold text-foreground">${value}</h3>
        </div>
        <div class="h-10 w-10 rounded-xl bg-${colorClass}/10 text-${colorClass} flex-center">
          <i data-lucide="${icon}" class="h-5 w-5"></i>
        </div>
      </div>
      <p class="text-xs font-medium text-muted-foreground mt-4">${subtitle}</p>
    </div>
  `;
}

function renderPlaceholderPage(pageId) {
  return `
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="h-24 w-24 rounded-full bg-primary/10 text-primary flex-center mb-6 animate-scale-in">
        <i data-lucide="${NAV_MENU.find(m => m.id === pageId)?.icon}" class="h-12 w-12"></i>
      </div>
      <h2 class="text-3xl font-bold mb-2 capitalize text-gradient">${pageId} Module</h2>
      <p class="text-muted-foreground max-w-md">
        This section is under construction. In the full version, this will contain data grids, detailed forms, and interactive tools for managing your ${pageId}.
      </p>
      <button class="btn-primary mt-8 px-6 py-3" onclick="navigate('dashboard')">Back to Dashboard</button>
    </div>
  `;
}

/* ===== 10. CHARTS (Chart.js) ===== */
function renderDashboardCharts() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#9ca3af' : '#4b5563';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  
  // We compute actual HSL values roughly to match theme for canvas
  const primaryColor = isDark ? '#a78bfa' : '#7c3aed'; 
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(124, 58, 237, 0.4)');
  gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

  chartInstances['revenue'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [{
        label: 'Revenue',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: primaryColor,
        backgroundColor: gradient,
        borderWidth: 3,
        pointBackgroundColor: primaryColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          titleColor: isDark ? '#ffffff' : '#000000',
          bodyColor: isDark ? '#d1d5db' : '#4b5563',
          borderColor: isDark ? '#374151' : '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return CONFIG.currency + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { color: textColor, font: { family: 'Outfit' } }
        },
        y: {
          grid: { color: gridColor, drawBorder: false },
          ticks: { 
            color: textColor, 
            font: { family: 'Outfit' },
            callback: function(value) {
              return '$' + (value / 1000) + 'k';
            }
          }
        }
      }
    }
  });
}

/* ===== 11. TOAST NOTIFICATIONS ===== */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  
  toast.innerHTML = `
    <i data-lucide="${icon}" class="h-6 w-6 ${iconColor}"></i>
    <span class="font-medium text-sm">${message}</span>
  `;
  
  DOM.toastContainer.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Bootstrap
document.addEventListener('DOMContentLoaded', initApp);
