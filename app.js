/* ==========================================================================
   Synthworks Dashboard - Premium Application Logic with Full CRUD
   ========================================================================== */

/* ===== 1. APP CONFIGURATION ===== */
let CONFIG = {
  appName: 'Synthworks',
  userName: '',
  userRole: 'Founder',
  userEmail: '',
  currency: '$',
};

/* ===== 2. DATA STORES (with LocalStorage persistence) ===== */
function loadData(key, defaultData = []) {
  const data = localStorage.getItem(`synthworks_${key}`);
  return data ? JSON.parse(data) : defaultData;
}
function saveData(key, data) {
  localStorage.setItem(`synthworks_${key}`, JSON.stringify(data));
}

let PROJECTS = loadData('projects');
let TASKS = loadData('tasks');
let CLIENTS = loadData('clients');
let FINANCE = loadData('finance');
let TEAM = loadData('team');

function getDashboardStats() {
  const totalRev = FINANCE.reduce((sum, item) => sum + Number(item.amount), 0);
  const activeProj = PROJECTS.filter(p => p.status === 'active').length;
  const pendingTasks = TASKS.filter(t => t.status === 'pending').length;
  return { totalRevenue: totalRev, activeProjects: activeProj, pendingTasks: pendingTasks, clientSatisfaction: CLIENTS.length > 0 ? 100 : 0 };
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
    if (!email || !pass) return errorEl.textContent = 'Enter email and password.', errorEl.classList.remove('hidden');
    
    errorEl.classList.add('hidden');
    const savedConfig = loadData('config', { appName: 'My Workspace', userName: email.split('@')[0], userEmail: email });
    Object.assign(CONFIG, savedConfig);
    
    localStorage.setItem('synthworks_session', JSON.stringify({ name: CONFIG.userName, workspace: CONFIG.appName, email: CONFIG.userEmail }));
    showToast('Welcome back, ' + CONFIG.userName + '!', 'success');
    completeLogin();
  });

  document.getElementById('btn-register')?.addEventListener('click', () => {
    const first = document.getElementById('reg-first').value.trim();
    const workspace = document.getElementById('reg-workspace').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const errorEl = document.getElementById('register-error');
    
    if (!first || !workspace || !email) return errorEl.textContent = 'Fill all fields.', errorEl.classList.remove('hidden');
    
    errorEl.classList.add('hidden');
    CONFIG.userName = first;
    CONFIG.appName = workspace;
    CONFIG.userEmail = email;
    saveData('config', CONFIG);
    
    localStorage.setItem('synthworks_session', JSON.stringify({ name: CONFIG.userName, workspace: CONFIG.appName, email: CONFIG.userEmail }));
    showToast('Workspace created successfully!', 'success');
    completeLogin();
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('synthworks_session');
    DOM.authScreen.classList.remove('hidden');
    setTimeout(() => { DOM.authScreen.style.opacity = '1'; DOM.authScreen.style.pointerEvents = 'auto'; }, 10);
    showToast('Signed out.', 'info');
  });
}

function completeLogin() {
  DOM.authScreen.style.opacity = '0';
  DOM.authScreen.style.pointerEvents = 'none';
  setTimeout(() => DOM.authScreen.classList.add('hidden'), 500);
  
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
    showToast(`Switched to ${document.documentElement.classList.contains('dark') ? 'Dark' : 'Light'} Mode`, 'info');
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
    el.innerHTML = `<i data-lucide="${item.icon}" class="h-5 w-5"></i><span>${item.label}</span>`;
    el.addEventListener('click', () => { navigate(item.id); if (window.innerWidth < 1024) toggleSidebar(); });
    DOM.sidebarNav.appendChild(el);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ===== 8. ROUTING ===== */
function navigate(pageId) {
  currentPage = pageId;
  const pageDef = NAV_MENU.find(m => m.id === pageId);
  DOM.pageTitle.textContent = pageDef ? pageDef.label : 'Dashboard';
  
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.remove('active');
    if (el.textContent.trim() === DOM.pageTitle.textContent) el.classList.add('active');
  });

  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  DOM.mainContent.innerHTML = `<div class="page-content" id="page-${pageId}"></div>`;
  const pageContainer = document.getElementById(`page-${pageId}`);
  
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
  if (pageId === 'dashboard') renderDashboardCharts();

  setTimeout(() => {
    pageContainer.classList.add('active');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 50);
}

/* ===== 9. GENERIC MODAL ===== */
function showModal(title, formHTML, onSave) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in';
  overlay.innerHTML = `
    <div class="glass premium-card w-full max-w-md p-6 animate-scale-in m-4">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">${title}</h3>
        <button class="text-muted-foreground hover:text-foreground" onclick="this.closest('.fixed').remove()">
          <i data-lucide="x" class="h-5 w-5"></i>
        </button>
      </div>
      <form id="modal-form" class="space-y-4" onsubmit="event.preventDefault(); window.submitModal()">
        ${formHTML}
        <div class="flex justify-end gap-3 mt-8">
          <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-accent" onclick="this.closest('.fixed').remove()">Cancel</button>
          <button type="submit" class="btn-primary px-4 py-2 text-sm">Save</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  window.submitModal = () => { onSave(); overlay.remove(); navigate(currentPage); };
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
      ${renderStatCard('Client Satisfaction', stats.clientSatisfaction + '%', 'Based on feedback', 'heart', 'success')}
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="xl:col-span-2 premium-card p-6 glass">
        <h3 class="text-xl font-bold mb-6">Revenue Overview</h3>
        <div class="h-[300px] w-full relative"><canvas id="revenueChart"></canvas></div>
      </div>
      <div class="premium-card p-6 glass flex flex-col h-[400px]">
        <h3 class="text-xl font-bold mb-6 shrink-0">Active Projects</h3>
        <div class="space-y-6 flex-1 overflow-y-auto pr-2">
          ${PROJECTS.length ? PROJECTS.filter(p=>p.status==='active').map(p => `
            <div>
              <div class="flex justify-between mb-2">
                <div><h4 class="font-bold text-sm">${p.name}</h4></div>
                <span class="text-xs font-bold text-primary">${p.progress}%</span>
              </div>
              <div class="progress-bg"><div class="progress-fill" style="width: ${p.progress}%"></div></div>
            </div>
          `).join('') : '<p class="text-sm text-muted-foreground text-center">No active projects.</p>'}
        </div>
        <button class="w-full mt-4 btn-primary py-2 text-sm shrink-0" onclick="navigate('projects')">View Projects</button>
      </div>
    </div>
  `;
}
function renderStatCard(title, value, subtitle, icon, colorClass) {
  return `
    <div class="premium-card p-6 glass">
      <div class="flex justify-between items-start">
        <div><p class="text-sm font-medium text-muted-foreground mb-1">${title}</p><h3 class="text-3xl font-bold">${value}</h3></div>
        <div class="h-10 w-10 rounded-xl bg-${colorClass}/10 text-${colorClass} flex-center"><i data-lucide="${icon}" class="h-5 w-5"></i></div>
      </div>
      <p class="text-xs text-muted-foreground mt-4">${subtitle}</p>
    </div>`;
}
function renderDashboardCharts() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx || typeof Chart === 'undefined') return;
  const isDark = document.documentElement.classList.contains('dark');
  const gradient = ctx.getContext('2d').createLinearGradient(0,0,0,400);
  gradient.addColorStop(0, isDark ? 'rgba(20, 184, 166, 0.5)' : 'rgba(13, 148, 136, 0.5)'); // Teal
  gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');
  chartInstances['revenue'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: FINANCE.map((_, i) => `Inv ${i+1}`),
      datasets: [{
        label: 'Revenue',
        data: FINANCE.map(f => f.amount),
        borderColor: isDark ? '#14b8a6' : '#0d9488', // Teal
        backgroundColor: gradient,
        borderWidth: 3, pointRadius: 4, fill: true, tension: 0.4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }
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
      <input id="p-prog" type="number" min="0" max="100" class="premium-input" placeholder="Progress %" required>
      <select id="p-status" class="premium-input"><option value="active">Active</option><option value="completed">Completed</option></select>
    `, () => {
      PROJECTS.push({ id: Date.now(), name: document.getElementById('p-name').value, client: document.getElementById('p-client').value, progress: document.getElementById('p-prog').value, status: document.getElementById('p-status').value });
      saveData('projects', PROJECTS); showToast('Project added');
    });
  };
  window.delProject = (id) => { PROJECTS = PROJECTS.filter(p => p.id !== id); saveData('projects', PROJECTS); navigate('projects'); showToast('Project deleted'); };

  return `
    <div class="flex justify-between mb-6"><h2 class="text-xl font-bold">Projects</h2><button class="btn-primary px-4 py-2 text-sm" onclick="addProject()">+ Add Project</button></div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      ${PROJECTS.length ? PROJECTS.map(p => `
        <div class="premium-card p-6 glass">
          <div class="flex justify-between items-start mb-4">
            <div><h3 class="font-bold text-lg">${p.name}</h3><p class="text-sm text-muted-foreground">${p.client}</p></div>
            <button onclick="delProject(${p.id})" class="text-destructive hover:bg-destructive/10 p-1 rounded"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
          </div>
          <div class="mb-2 flex justify-between"><span class="text-xs uppercase font-bold text-primary">${p.status}</span><span class="text-sm font-bold">${p.progress}%</span></div>
          <div class="progress-bg"><div class="progress-fill" style="width: ${p.progress}%"></div></div>
        </div>
      `).join('') : '<p class="text-muted-foreground">No projects found.</p>'}
    </div>
  `;
}

/* --- TASKS --- */
function renderTasksPage() {
  window.addTask = () => {
    showModal('New Task', `<input id="t-title" class="premium-input" placeholder="Task Title" required>`, () => {
      TASKS.push({ id: Date.now(), title: document.getElementById('t-title').value, status: 'pending' });
      saveData('tasks', TASKS); showToast('Task added');
    });
  };
  window.delTask = (id) => { TASKS = TASKS.filter(t => t.id !== id); saveData('tasks', TASKS); navigate('tasks'); showToast('Task deleted'); };
  window.toggleTask = (id) => { const t = TASKS.find(x => x.id === id); if(t) t.status = t.status === 'pending' ? 'completed' : 'pending'; saveData('tasks', TASKS); navigate('tasks'); };

  return `
    <div class="flex justify-between mb-6"><h2 class="text-xl font-bold">Tasks</h2><button class="btn-primary px-4 py-2 text-sm" onclick="addTask()">+ Add Task</button></div>
    <div class="premium-card glass divide-y divide-border">
      ${TASKS.length ? TASKS.map(t => `
        <div class="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
          <div class="flex items-center gap-4 cursor-pointer" onclick="toggleTask(${t.id})">
            <div class="h-6 w-6 rounded border flex-center ${t.status === 'completed' ? 'bg-primary border-primary text-white' : 'border-border'}">
              ${t.status === 'completed' ? '<i data-lucide="check" class="h-4 w-4"></i>' : ''}
            </div>
            <span class="font-medium ${t.status === 'completed' ? 'line-through text-muted-foreground' : ''}">${t.title}</span>
          </div>
          <button onclick="delTask(${t.id})" class="text-destructive hover:bg-destructive/10 p-2 rounded"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
        </div>
      `).join('') : '<div class="p-8 text-center text-muted-foreground">No tasks.</div>'}
    </div>
  `;
}

/* --- CLIENTS --- */
function renderClientsPage() {
  window.addClient = () => {
    showModal('New Client', `<input id="c-name" class="premium-input" placeholder="Company Name" required><input id="c-contact" class="premium-input" placeholder="Contact Person" required>`, () => {
      CLIENTS.push({ id: Date.now(), name: document.getElementById('c-name').value, contact: document.getElementById('c-contact').value });
      saveData('clients', CLIENTS); showToast('Client added');
    });
  };
  window.delClient = (id) => { CLIENTS = CLIENTS.filter(c => c.id !== id); saveData('clients', CLIENTS); navigate('clients'); showToast('Client deleted'); };

  return `
    <div class="flex justify-between mb-6"><h2 class="text-xl font-bold">Clients</h2><button class="btn-primary px-4 py-2 text-sm" onclick="addClient()">+ Add Client</button></div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${CLIENTS.length ? CLIENTS.map(c => `
        <div class="premium-card p-6 glass flex justify-between items-center">
          <div><h3 class="font-bold text-lg">${c.name}</h3><p class="text-sm text-muted-foreground"><i data-lucide="user" class="inline h-3 w-3"></i> ${c.contact}</p></div>
          <button onclick="delClient(${c.id})" class="text-destructive hover:bg-destructive/10 p-2 rounded"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
        </div>
      `).join('') : '<p class="text-muted-foreground">No clients found.</p>'}
    </div>
  `;
}

/* --- FINANCE --- */
function renderFinancePage() {
  window.addFin = () => {
    showModal('New Record', `<input id="f-desc" class="premium-input" placeholder="Description" required><input id="f-amt" type="number" class="premium-input" placeholder="Amount" required>`, () => {
      FINANCE.push({ id: Date.now(), desc: document.getElementById('f-desc').value, amount: Number(document.getElementById('f-amt').value) });
      saveData('finance', FINANCE); showToast('Record added');
    });
  };
  window.delFin = (id) => { FINANCE = FINANCE.filter(f => f.id !== id); saveData('finance', FINANCE); navigate('finance'); showToast('Record deleted'); };

  return `
    <div class="flex justify-between mb-6"><h2 class="text-xl font-bold">Finance</h2><button class="btn-primary px-4 py-2 text-sm" onclick="addFin()">+ Add Record</button></div>
    <div class="premium-card glass divide-y divide-border">
      ${FINANCE.length ? FINANCE.map(f => `
        <div class="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
          <div><h4 class="font-bold">${f.desc}</h4><p class="text-xs text-muted-foreground">ID: ${f.id}</p></div>
          <div class="flex items-center gap-4">
            <span class="font-bold text-primary">${CONFIG.currency}${f.amount.toLocaleString()}</span>
            <button onclick="delFin(${f.id})" class="text-destructive hover:bg-destructive/10 p-2 rounded"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
          </div>
        </div>
      `).join('') : '<div class="p-8 text-center text-muted-foreground">No financial records.</div>'}
    </div>
  `;
}

/* --- TEAM --- */
function renderTeamPage() {
  window.addTeam = () => {
    showModal('Add Member', `<input id="m-name" class="premium-input" placeholder="Name" required><input id="m-role" class="premium-input" placeholder="Role (e.g. Designer)" required>`, () => {
      TEAM.push({ id: Date.now(), name: document.getElementById('m-name').value, role: document.getElementById('m-role').value });
      saveData('team', TEAM); showToast('Member added');
    });
  };
  window.delTeam = (id) => { TEAM = TEAM.filter(m => m.id !== id); saveData('team', TEAM); navigate('team'); showToast('Member deleted'); };

  return `
    <div class="flex justify-between mb-6"><h2 class="text-xl font-bold">Team</h2><button class="btn-primary px-4 py-2 text-sm" onclick="addTeam()">+ Add Member</button></div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${TEAM.length ? TEAM.map(m => `
        <div class="premium-card p-6 glass text-center relative">
          <button onclick="delTeam(${m.id})" class="absolute top-2 right-2 text-destructive hover:bg-destructive/10 p-1 rounded"><i data-lucide="x" class="h-4 w-4"></i></button>
          <div class="h-16 w-16 mx-auto rounded-full bg-primary/20 text-primary font-bold text-xl flex-center mb-4">${m.name.charAt(0)}</div>
          <h3 class="font-bold">${m.name}</h3>
          <p class="text-sm text-muted-foreground">${m.role}</p>
        </div>
      `).join('') : '<p class="text-muted-foreground">No team members added.</p>'}
    </div>
  `;
}

/* --- SETTINGS --- */
function renderSettingsPage() {
  window.saveSettings = () => {
    CONFIG.appName = document.getElementById('s-app').value;
    CONFIG.userName = document.getElementById('s-user').value;
    CONFIG.currency = document.getElementById('s-curr').value;
    saveData('config', CONFIG);
    
    // Update local session
    const session = JSON.parse(localStorage.getItem('synthworks_session')) || {};
    session.workspace = CONFIG.appName;
    session.name = CONFIG.userName;
    localStorage.setItem('synthworks_session', JSON.stringify(session));
    
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
        <button class="btn-primary px-6 py-2" onclick="saveSettings()">Save Changes</button>
      </div>
    </div>
  `;
}

/* ===== 11. TOAST ===== */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  toast.innerHTML = `<i data-lucide="${icon}" class="h-6 w-6 ${iconColor}"></i><span class="font-medium text-sm">${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Bootstrap
document.addEventListener('DOMContentLoaded', initApp);
