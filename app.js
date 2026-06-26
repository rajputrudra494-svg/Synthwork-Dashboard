/* ==========================================================================
   Synthworks Dashboard - RBAC Enabled Application Logic (v3)
   ========================================================================== */

/* ===== SVG ICON LIBRARY ===== */
const ICONS = {
  'layout-dashboard': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
  'folder-kanban': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>',
  'check-square': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>',
  'building-2': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
  'dollar-sign': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  'users': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'settings': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  'trash-2': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
  'check': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  'x': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  'heart': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  'user': '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
  'alert-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
  'info': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
};

function icon(name) { return ICONS[name] || ''; }

/* ===== 1. APP CONFIGURATION ===== */
let CONFIG = {
  appName: 'Synthworks',
  userName: '',
  userRole: 'employee',
  userEmail: '',
  userId: null,
  currency: '$',
};

/* ===== 2. LOCAL RBAC DATA ENGINE ===== */
function getDB() {
  return JSON.parse(localStorage.getItem('synthworks_db')) || {
    users: [], projects: [], tasks: [], clients: [], finance: [], team: []
  };
}
function saveDB(db) {
  localStorage.setItem('synthworks_db', JSON.stringify(db));
}

function rlsFilter(tableData) {
  if (CONFIG.userRole === 'founder' || CONFIG.userRole === 'co-founder') {
    return tableData;
  }
  return tableData.filter(item => item.ownerId === CONFIG.userId);
}

function loadTable(table) {
  const db = getDB();
  return rlsFilter(db[table] || []);
}

function insertRow(table, data) {
  const db = getDB();
  data.ownerId = CONFIG.userId;
  data.ownerName = CONFIG.userName;
  data.id = Date.now();
  db[table].push(data);
  saveDB(db);
  return data;
}

function deleteRow(table, id) {
  const db = getDB();
  const index = db[table].findIndex(x => x.id === id);
  if (index === -1) return;
  if (CONFIG.userRole !== 'founder' && CONFIG.userRole !== 'co-founder' && db[table][index].ownerId !== CONFIG.userId) {
    showToast('Permission Denied', 'error');
    return;
  }
  db[table].splice(index, 1);
  saveDB(db);
}

let PROJECTS = [];
let TASKS = [];
let CLIENTS = [];
let FINANCE = [];
let TEAM = [];

function reloadState() {
  PROJECTS = loadTable('projects');
  TASKS = loadTable('tasks');
  CLIENTS = loadTable('clients');
  FINANCE = loadTable('finance');
  TEAM = loadTable('team');
}

function getDashboardStats() {
  const totalRev = FINANCE.reduce((sum, item) => sum + Number(item.amount), 0);
  const activeProj = PROJECTS.filter(p => p.status === 'active').length;
  const pendingTasks = TASKS.filter(t => t.status === 'pending').length;
  return { totalRevenue: totalRev, activeProjects: activeProj, pendingTasks: pendingTasks, totalClients: CLIENTS.length };
}

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
  
  const session = localStorage.getItem('synthworks_session');
  if (session) {
    try {
      const user = JSON.parse(session);
      if (!user.id || !user.role) {
        // Old/corrupted session — force re-login
        localStorage.removeItem('synthworks_session');
        showAuthScreen();
        return;
      }
      CONFIG.userName = user.name || 'User';
      CONFIG.appName = user.workspace || 'Synthworks';
      CONFIG.userEmail = user.email || '';
      CONFIG.userRole = user.role;
      CONFIG.userId = user.id;
      completeLogin();
    } catch(e) {
      localStorage.removeItem('synthworks_session');
      showAuthScreen();
    }
  } else {
    showAuthScreen();
  }
}

function showAuthScreen() {
  DOM.authScreen.classList.remove('hidden');
  DOM.authScreen.style.opacity = '1';
  DOM.authScreen.style.pointerEvents = 'auto';
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
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('btn-login')?.addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    if (!email || !pass) { errorEl.textContent = 'Enter email and password.'; errorEl.classList.remove('hidden'); return; }
    
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === pass);
    if (!user) { errorEl.textContent = 'Invalid credentials.'; errorEl.classList.remove('hidden'); return; }

    errorEl.classList.add('hidden');
    CONFIG.userName = user.name;
    CONFIG.appName = user.workspace;
    CONFIG.userEmail = user.email;
    CONFIG.userRole = user.role;
    CONFIG.userId = user.id;
    
    localStorage.setItem('synthworks_session', JSON.stringify({ id: user.id, name: user.name, workspace: user.workspace, email: user.email, role: user.role }));
    showToast('Welcome back, ' + CONFIG.userName + '!', 'success');
    completeLogin();
  });

  document.getElementById('btn-register')?.addEventListener('click', () => {
    const first = document.getElementById('reg-first').value.trim();
    const workspace = document.getElementById('reg-workspace').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const secret = document.getElementById('reg-secret')?.value || '';
    const errorEl = document.getElementById('register-error');
    
    if (!first || !workspace || !email || !pass) { errorEl.textContent = 'Fill all required fields.'; errorEl.classList.remove('hidden'); return; }
    
    // SECRET QUESTION VERIFICATION FOR FOUNDERS & CO-FOUNDERS
    if ((role === 'founder' || role === 'co-founder') && secret !== 'daaru') {
      errorEl.textContent = 'Invalid founder secret phrase.'; errorEl.classList.remove('hidden'); return;
    }

    const db = getDB();
    if (db.users.find(u => u.email === email)) { errorEl.textContent = 'Email already registered.'; errorEl.classList.remove('hidden'); return; }

    const newUser = { id: Date.now(), name: first, email, password: pass, workspace, role };
    db.users.push(newUser);
    saveDB(db);

    errorEl.classList.add('hidden');
    CONFIG.userName = newUser.name;
    CONFIG.appName = newUser.workspace;
    CONFIG.userEmail = newUser.email;
    CONFIG.userRole = newUser.role;
    CONFIG.userId = newUser.id;
    
    localStorage.setItem('synthworks_session', JSON.stringify({ id: newUser.id, name: newUser.name, workspace: newUser.workspace, email: newUser.email, role: newUser.role }));
    showToast('Account created successfully!', 'success');
    completeLogin();
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('synthworks_session');
    DOM.authScreen.classList.remove('hidden');
    setTimeout(() => { DOM.authScreen.style.opacity = '1'; DOM.authScreen.style.pointerEvents = 'auto'; }, 10);
    // Reset login form to visible
    DOM.loginForm.classList.remove('hidden');
    DOM.registerForm.classList.add('hidden');
    showToast('Signed out.', 'info');
  });
}

function completeLogin() {
  reloadState();
  
  DOM.authScreen.style.opacity = '0';
  DOM.authScreen.style.pointerEvents = 'none';
  setTimeout(() => DOM.authScreen.classList.add('hidden'), 500);
  
  DOM.userName.textContent = CONFIG.userName;
  DOM.appName.textContent = CONFIG.appName;
  DOM.userRole.textContent = (CONFIG.userRole || 'employee').toUpperCase();
  DOM.userAvatar.textContent = CONFIG.userName.charAt(0).toUpperCase();
  
  buildSidebar();
  navigate('dashboard');
}

/* ===== 7. UI EVENTS & SIDEBAR ===== */
function bindUIEvents() {
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (currentPage === 'dashboard') setTimeout(() => renderDashboardCharts(), 100);
  });
  document.getElementById('btn-open-sidebar')?.addEventListener('click', toggleSidebar);
  document.getElementById('btn-close-sidebar')?.addEventListener('click', toggleSidebar);
  DOM.sidebarOverlay?.addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
  const isOpen = DOM.sidebar.classList.contains('translate-x-0');
  if (isOpen) {
    DOM.sidebar.classList.replace('translate-x-0', '-translate-x-full');
    DOM.sidebarOverlay.classList.add('hidden');
    DOM.sidebarOverlay.style.opacity = '0';
  } else {
    DOM.sidebar.classList.replace('-translate-x-full', 'translate-x-0');
    DOM.sidebarOverlay.classList.remove('hidden');
    setTimeout(() => DOM.sidebarOverlay.style.opacity = '1', 10);
  }
}

function buildSidebar() {
  DOM.sidebarNav.innerHTML = '';
  NAV_MENU.forEach(item => {
    const el = document.createElement('div');
    el.className = `sidebar-item ${item.id === currentPage ? 'active' : ''}`;
    el.dataset.page = item.id;
    el.innerHTML = `<span class="sidebar-icon">${icon(item.icon)}</span><span>${item.label}</span>`;
    el.addEventListener('click', () => { navigate(item.id); if (window.innerWidth < 1024) toggleSidebar(); });
    DOM.sidebarNav.appendChild(el);
  });
}

/* ===== 8. ROUTING ===== */
function navigate(pageId) {
  currentPage = pageId;
  reloadState();
  const pageDef = NAV_MENU.find(m => m.id === pageId);
  DOM.pageTitle.textContent = pageDef ? pageDef.label : 'Dashboard';
  
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  Object.values(chartInstances).forEach(c => { try { c.destroy(); } catch(e) {} });
  chartInstances = {};

  DOM.mainContent.innerHTML = '';
  const pageContainer = document.createElement('div');
  pageContainer.className = 'page-content';
  pageContainer.id = `page-${pageId}`;
  DOM.mainContent.appendChild(pageContainer);
  
  const renderMap = {
    'dashboard': renderDashboardPage,
    'projects': renderProjectsPage,
    'tasks': renderTasksPage,
    'clients': renderClientsPage,
    'finance': renderFinancePage,
    'team': renderTeamPage,
    'settings': renderSettingsPage
  };

  pageContainer.innerHTML = (renderMap[pageId] || (() => ''))();
  if (pageId === 'dashboard') setTimeout(() => renderDashboardCharts(), 50);

  // Trigger animation
  requestAnimationFrame(() => {
    pageContainer.classList.add('active');
  });
}

/* ===== 9. GENERIC MODAL ===== */
function showModal(title, formHTML, onSave) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `
    <div class="glass premium-card w-full max-w-md p-6 animate-scale-in m-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">${title}</h3>
        <button type="button" class="text-muted-foreground hover:text-foreground cursor-pointer" id="modal-close-btn">
          ${icon('x')}
        </button>
      </div>
      <form id="modal-form" class="space-y-4">
        ${formHTML}
        <div class="flex justify-end gap-3 mt-8">
          <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-accent cursor-pointer" id="modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn-primary px-4 py-2 text-sm cursor-pointer">Save</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  
  const closeModal = () => overlay.remove();
  overlay.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  overlay.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);
  overlay.querySelector('#modal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    onSave();
    closeModal();
    navigate(currentPage);
  });
}

/* ===== 10. PAGES & CRUD LOGIC ===== */

/* --- DASHBOARD --- */
function renderDashboardPage() {
  const stats = getDashboardStats();
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      ${renderStatCard('Total Revenue', CONFIG.currency + stats.totalRevenue.toLocaleString(), 'Lifetime revenue', 'dollar-sign', 'primary')}
      ${renderStatCard('Active Projects', stats.activeProjects, 'Currently running', 'folder-kanban', 'secondary')}
      ${renderStatCard('Pending Tasks', stats.pendingTasks, 'Need attention', 'check-square', 'accent-foreground')}
      ${renderStatCard('Total Clients', stats.totalClients, 'In your workspace', 'building-2', 'primary')}
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="xl:col-span-2 premium-card p-6 glass">
        <h3 class="text-xl font-bold mb-6">Revenue Overview</h3>
        <div class="h-[300px] w-full relative"><canvas id="revenueChart"></canvas></div>
      </div>
      <div class="premium-card p-6 glass flex flex-col h-[400px]">
        <h3 class="text-xl font-bold mb-6 shrink-0">Active Projects</h3>
        <div class="space-y-6 flex-1 overflow-y-auto pr-2">
          ${PROJECTS.filter(p=>p.status==='active').length ? PROJECTS.filter(p=>p.status==='active').map(p => `
            <div>
              <div class="flex justify-between mb-2">
                <h4 class="font-bold text-sm">${p.name}</h4>
                <span class="text-xs font-bold text-primary">${p.progress}%</span>
              </div>
              <div class="progress-bg"><div class="progress-fill" style="width: ${p.progress}%"></div></div>
            </div>
          `).join('') : '<p class="text-sm text-muted-foreground text-center mt-8">No active projects yet.</p>'}
        </div>
        <button class="w-full mt-4 btn-primary py-2.5 text-sm shrink-0 cursor-pointer" onclick="navigate('projects')">View All Projects</button>
      </div>
    </div>
  `;
}
function renderStatCard(title, value, subtitle, iconName, colorClass) {
  return `
    <div class="premium-card p-6 glass">
      <div class="flex justify-between items-start">
        <div><p class="text-sm font-medium text-muted-foreground mb-1">${title}</p><h3 class="text-3xl font-bold">${value}</h3></div>
        <div class="h-10 w-10 rounded-xl bg-primary/10 text-primary flex-center">${icon(iconName)}</div>
      </div>
      <p class="text-xs text-muted-foreground mt-4">${subtitle}</p>
    </div>`;
}
function renderDashboardCharts() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx || typeof Chart === 'undefined') return;
  const isDark = document.documentElement.classList.contains('dark');
  const gradient = ctx.getContext('2d').createLinearGradient(0,0,0,400);
  gradient.addColorStop(0, isDark ? 'rgba(20, 184, 166, 0.5)' : 'rgba(13, 148, 136, 0.5)');
  gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');
  chartInstances['revenue'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: FINANCE.length ? FINANCE.map((_, i) => `Record ${i+1}`) : ['No data'],
      datasets: [{
        label: 'Revenue',
        data: FINANCE.length ? FINANCE.map(f => f.amount) : [0],
        borderColor: isDark ? '#14b8a6' : '#0d9488',
        backgroundColor: gradient,
        borderWidth: 3, pointRadius: 4, fill: true, tension: 0.4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: isDark ? '#64748b' : '#94a3b8' } },
        y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: isDark ? '#64748b' : '#94a3b8' } }
      }
    }
  });
}

/* --- PROJECTS --- */
function renderProjectsPage() {
  window.addProject = () => {
    showModal('New Project', `
      <input id="p-name" class="premium-input" placeholder="Project Name" required>
      <input id="p-client" class="premium-input" placeholder="Client Name" required>
      <input id="p-prog" type="number" min="0" max="100" class="premium-input" placeholder="Progress %" value="0" required>
      <select id="p-status" class="premium-input"><option value="active">Active</option><option value="completed">Completed</option><option value="paused">Paused</option></select>
    `, () => {
      insertRow('projects', { name: document.getElementById('p-name').value, client: document.getElementById('p-client').value, progress: Number(document.getElementById('p-prog').value), status: document.getElementById('p-status').value });
      showToast('Project added');
    });
  };
  window.delProject = (id) => { deleteRow('projects', id); navigate('projects'); showToast('Project deleted'); };

  const isFounder = CONFIG.userRole === 'founder' || CONFIG.userRole === 'co-founder';

  return `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Projects <span class="text-sm text-muted-foreground font-normal ml-2">(${PROJECTS.length})</span></h2>
      <button class="btn-primary px-4 py-2 text-sm cursor-pointer" onclick="addProject()">+ Add Project</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      ${PROJECTS.length ? PROJECTS.map(p => `
        <div class="premium-card p-6 glass">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-lg">${p.name}</h3>
              <p class="text-sm text-muted-foreground">${p.client}</p>
            </div>
            <button onclick="delProject(${p.id})" class="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg cursor-pointer">${icon('trash-2')}</button>
          </div>
          ${isFounder && p.ownerName ? `<p class="text-xs text-muted-foreground mb-2">By: ${p.ownerName}</p>` : ''}
          <div class="mb-2 flex justify-between">
            <span class="text-xs uppercase font-bold ${p.status === 'active' ? 'text-primary' : p.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}">${p.status}</span>
            <span class="text-sm font-bold">${p.progress}%</span>
          </div>
          <div class="progress-bg"><div class="progress-fill" style="width: ${p.progress}%"></div></div>
        </div>
      `).join('') : '<div class="col-span-full text-center py-12 text-muted-foreground"><p class="text-lg">No projects yet</p><p class="text-sm mt-1">Click "+ Add Project" to create your first project</p></div>'}
    </div>
  `;
}

/* --- TASKS --- */
function renderTasksPage() {
  window.addTask = () => {
    showModal('New Task', `<input id="t-title" class="premium-input" placeholder="Task Title" required>`, () => {
      insertRow('tasks', { title: document.getElementById('t-title').value, status: 'pending' });
      showToast('Task added');
    });
  };
  window.delTask = (id) => { deleteRow('tasks', id); navigate('tasks'); showToast('Task deleted'); };
  window.toggleTask = (id) => { 
    const db = getDB(); 
    const t = db.tasks.find(x => x.id === id); 
    if(t) { t.status = t.status === 'pending' ? 'completed' : 'pending'; saveDB(db); navigate('tasks'); }
  };

  const pending = TASKS.filter(t => t.status === 'pending').length;
  const done = TASKS.filter(t => t.status === 'completed').length;

  return `
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Tasks</h2>
        <p class="text-sm text-muted-foreground">${pending} pending · ${done} completed</p>
      </div>
      <button class="btn-primary px-4 py-2 text-sm cursor-pointer" onclick="addTask()">+ Add Task</button>
    </div>
    <div class="premium-card glass divide-y divide-border">
      ${TASKS.length ? TASKS.map(t => `
        <div class="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
          <div class="flex items-center gap-4 cursor-pointer flex-1" onclick="toggleTask(${t.id})">
            <div class="h-6 w-6 rounded border-2 flex-center shrink-0 transition-colors ${t.status === 'completed' ? 'bg-primary border-primary text-white' : 'border-muted-foreground/30'}">
              ${t.status === 'completed' ? icon('check') : ''}
            </div>
            <div class="min-w-0">
              <span class="font-medium block ${t.status === 'completed' ? 'line-through text-muted-foreground' : ''}">${t.title}</span>
              ${t.ownerName ? `<span class="text-xs text-muted-foreground">by ${t.ownerName}</span>` : ''}
            </div>
          </div>
          <button onclick="delTask(${t.id})" class="text-destructive hover:bg-destructive/10 p-2 rounded-lg cursor-pointer shrink-0 ml-2">${icon('trash-2')}</button>
        </div>
      `).join('') : '<div class="p-12 text-center text-muted-foreground"><p class="text-lg">No tasks yet</p><p class="text-sm mt-1">Click "+ Add Task" to get started</p></div>'}
    </div>
  `;
}

/* --- CLIENTS --- */
function renderClientsPage() {
  window.addClient = () => {
    showModal('New Client', `
      <input id="c-name" class="premium-input" placeholder="Company Name" required>
      <input id="c-contact" class="premium-input" placeholder="Contact Person" required>
    `, () => {
      insertRow('clients', { name: document.getElementById('c-name').value, contact: document.getElementById('c-contact').value });
      showToast('Client added');
    });
  };
  window.delClient = (id) => { deleteRow('clients', id); navigate('clients'); showToast('Client deleted'); };

  return `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Clients <span class="text-sm text-muted-foreground font-normal ml-2">(${CLIENTS.length})</span></h2>
      <button class="btn-primary px-4 py-2 text-sm cursor-pointer" onclick="addClient()">+ Add Client</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      ${CLIENTS.length ? CLIENTS.map(c => `
        <div class="premium-card p-6 glass flex justify-between items-center">
          <div>
            <h3 class="font-bold text-lg">${c.name}</h3>
            <p class="text-sm text-muted-foreground flex items-center gap-1 mt-1">${icon('user')} ${c.contact}</p>
          </div>
          <button onclick="delClient(${c.id})" class="text-destructive hover:bg-destructive/10 p-2 rounded-lg cursor-pointer">${icon('trash-2')}</button>
        </div>
      `).join('') : '<div class="col-span-full text-center py-12 text-muted-foreground"><p class="text-lg">No clients yet</p><p class="text-sm mt-1">Click "+ Add Client" to add your first client</p></div>'}
    </div>
  `;
}

/* --- FINANCE --- */
function renderFinancePage() {
  const totalRev = FINANCE.reduce((sum, f) => sum + Number(f.amount), 0);
  
  window.addFin = () => {
    showModal('New Record', `
      <input id="f-desc" class="premium-input" placeholder="Description" required>
      <input id="f-amt" type="number" class="premium-input" placeholder="Amount" required>
    `, () => {
      insertRow('finance', { desc: document.getElementById('f-desc').value, amount: Number(document.getElementById('f-amt').value) });
      showToast('Record added');
    });
  };
  window.delFin = (id) => { deleteRow('finance', id); navigate('finance'); showToast('Record deleted'); };

  return `
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold">Finance</h2>
        <p class="text-sm text-muted-foreground">Total: <span class="text-primary font-bold">${CONFIG.currency}${totalRev.toLocaleString()}</span></p>
      </div>
      <button class="btn-primary px-4 py-2 text-sm cursor-pointer" onclick="addFin()">+ Add Record</button>
    </div>
    <div class="premium-card glass divide-y divide-border">
      ${FINANCE.length ? FINANCE.map(f => `
        <div class="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
          <div>
            <h4 class="font-bold">${f.desc}</h4>
            ${f.ownerName ? `<p class="text-xs text-muted-foreground">by ${f.ownerName}</p>` : ''}
          </div>
          <div class="flex items-center gap-4">
            <span class="font-bold text-primary text-lg">${CONFIG.currency}${Number(f.amount).toLocaleString()}</span>
            <button onclick="delFin(${f.id})" class="text-destructive hover:bg-destructive/10 p-2 rounded-lg cursor-pointer">${icon('trash-2')}</button>
          </div>
        </div>
      `).join('') : '<div class="p-12 text-center text-muted-foreground"><p class="text-lg">No financial records</p><p class="text-sm mt-1">Click "+ Add Record" to track revenue</p></div>'}
    </div>
  `;
}

/* --- TEAM --- */
function renderTeamPage() {
  const isFounder = CONFIG.userRole === 'founder' || CONFIG.userRole === 'co-founder';
  
  window.addTeam = () => {
    if(!isFounder) { return showToast('Only founders can add team members', 'error'); }
    showModal('Add Member', `
      <input id="m-name" class="premium-input" placeholder="Name" required>
      <input id="m-role" class="premium-input" placeholder="Role (e.g. Designer)" required>
    `, () => {
      insertRow('team', { name: document.getElementById('m-name').value, role: document.getElementById('m-role').value });
      showToast('Member added');
    });
  };
  window.delTeam = (id) => { 
    if(!isFounder) { return showToast('Only founders can remove team members', 'error'); }
    deleteRow('team', id); navigate('team'); showToast('Member deleted'); 
  };
  
  const db = getDB();
  const registeredUsers = db.users.map(u => ({ id: u.id, name: u.name, role: u.role, isUser: true }));
  const manualTeam = TEAM.map(t => ({ ...t, isUser: false }));
  const allTeam = [...registeredUsers, ...manualTeam];
  const uniqueTeam = Array.from(new Map(allTeam.map(item => [item.id, item])).values());

  return `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Team <span class="text-sm text-muted-foreground font-normal ml-2">(${uniqueTeam.length} members)</span></h2>
      ${isFounder ? '<button class="btn-primary px-4 py-2 text-sm cursor-pointer" onclick="addTeam()">+ Add Member</button>' : ''}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${uniqueTeam.length ? uniqueTeam.map(m => `
        <div class="premium-card p-6 glass text-center relative">
          ${isFounder && !m.isUser ? `<button onclick="delTeam(${m.id})" class="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1 rounded-lg cursor-pointer">${icon('x')}</button>` : ''}
          <div class="h-16 w-16 mx-auto rounded-full bg-primary/20 text-primary font-bold text-xl flex-center mb-4">${m.name.charAt(0).toUpperCase()}</div>
          <h3 class="font-bold text-lg">${m.name}</h3>
          <p class="text-sm text-muted-foreground uppercase tracking-wide mt-1">${m.role}</p>
          ${m.isUser ? '<span class="inline-block mt-3 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Registered User</span>' : ''}
        </div>
      `).join('') : '<div class="col-span-full text-center py-12 text-muted-foreground"><p class="text-lg">No team members</p></div>'}
    </div>
  `;
}

/* --- SETTINGS --- */
function renderSettingsPage() {
  window.saveSettings = () => {
    CONFIG.appName = document.getElementById('s-app').value;
    CONFIG.userName = document.getElementById('s-user').value;
    CONFIG.currency = document.getElementById('s-curr').value;
    
    const session = JSON.parse(localStorage.getItem('synthworks_session')) || {};
    session.workspace = CONFIG.appName;
    session.name = CONFIG.userName;
    localStorage.setItem('synthworks_session', JSON.stringify(session));
    
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === CONFIG.userId);
    if (userIndex > -1) {
      db.users[userIndex].name = CONFIG.userName;
      db.users[userIndex].workspace = CONFIG.appName;
      saveDB(db);
    }
    
    DOM.appName.textContent = CONFIG.appName;
    DOM.userName.textContent = CONFIG.userName;
    DOM.userAvatar.textContent = CONFIG.userName.charAt(0).toUpperCase();
    showToast('Settings saved successfully!');
  };

  return `
    <div class="max-w-2xl">
      <h2 class="text-xl font-bold mb-6">Settings</h2>
      <div class="premium-card p-6 glass space-y-6">
        <div>
          <label class="block text-sm font-semibold mb-2">Workspace Name</label>
          <input id="s-app" class="premium-input" value="${CONFIG.appName}">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Your Name</label>
          <input id="s-user" class="premium-input" value="${CONFIG.userName}">
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Currency Symbol</label>
          <input id="s-curr" class="premium-input" value="${CONFIG.currency}">
        </div>
        <div class="pt-2">
          <p class="text-sm text-muted-foreground mb-1">Your Role: <span class="text-primary font-bold uppercase">${CONFIG.userRole}</span></p>
          <p class="text-sm text-muted-foreground">Email: <span class="font-medium">${CONFIG.userEmail}</span></p>
        </div>
        <button class="btn-primary px-6 py-2.5 cursor-pointer" onclick="saveSettings()">Save Changes</button>
      </div>
    </div>
  `;
}

/* ===== 11. TOAST ===== */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';
  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  toast.innerHTML = `<span class="${iconColor}">${icon(iconName)}</span><span class="font-medium text-sm">${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Bootstrap
initApp();
