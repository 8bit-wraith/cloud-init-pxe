// Unified netboot.xyz Studio Application

// Get baseurl from the current path or default to '/'
const baseurl = window.location.pathname.replace(/\/[^\/]*$/, '/') || '/';

// Global variables
let socket;
let currentPage = 'dashboard';
let charts = {};
let editors = {};
let currentConfig = null;
let currentFile = null;
let configs = {};
let templates = {};

// Initialize Socket.io when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize socket connection
  socket = io(window.location.origin, {path: baseurl + 'socket.io'});
  
  // Setup socket event handlers
  setupSocketHandlers();
  
  // Initialize the page
  showPage('dashboard');
  
  // Load theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon();
  
  // Load sidebar state
  const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (sidebarCollapsed) {
    document.getElementById('sidebar').classList.add('collapsed');
    document.querySelector('.sidebar-toggle i').className = 'fas fa-chevron-right';
  }
  
  // Handle keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save in editors
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (currentPage === 'cloud-init' && currentConfig) {
        saveCloudInitConfig();
      }
    }
    
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('.search-input').focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Global search functionality
  document.querySelector('.search-input').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    performGlobalSearch(query);
  });
});

// Page Navigation
function showPage(page) {
  currentPage = page;
  
  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNav = document.querySelector(`.nav-item[onclick="showPage('${page}')"]`);
  if (activeNav) activeNav.classList.add('active');
  
  // Update page title and header action
  const titles = {
    'dashboard': 'Dashboard',
    'menus': 'Boot Menus',
    'cloud-init': 'Cloud-Init Manager',
    'assets': 'Local Assets',
    'ipxe': 'iPXE Scripts',
    'logs': 'System Logs',
    'settings': 'Settings'
  };
  
  document.getElementById('page-title').textContent = titles[page] || page;
  
  // Update header action button
  const headerBtn = document.getElementById('header-action-btn');
  switch(page) {
    case 'cloud-init':
      headerBtn.innerHTML = '<i class="fas fa-plus"></i><span>New Config</span>';
      headerBtn.onclick = createCloudInitConfig;
      headerBtn.style.display = 'flex';
      break;
    case 'menus':
      headerBtn.innerHTML = '<i class="fas fa-plus"></i><span>New Menu</span>';
      headerBtn.onclick = createMenu;
      headerBtn.style.display = 'flex';
      break;
    default:
      headerBtn.style.display = 'none';
  }
  
  // Load page content
  loadPageContent(page);
}

// Load Page Content
function loadPageContent(page) {
  const content = document.getElementById('content');
  
  switch(page) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'menus':
      renderMenus();
      break;
    case 'cloud-init':
      renderCloudInit();
      break;
    case 'assets':
      renderAssets();
      break;
    case 'ipxe':
      renderIPXE();
      break;
    case 'logs':
      renderLogs();
      break;
    case 'settings':
      renderSettings();
      break;
  }
}

// Dashboard Page
function renderDashboard() {
  if (socket) socket.emit('getdash');
  
  const content = document.getElementById('content');
  content.innerHTML = `
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <i class="fas fa-server"></i>
        </div>
        <div class="stat-content">
          <h3 id="stat-version">-</h3>
          <p>Menu Version</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon success">
          <i class="fas fa-memory"></i>
        </div>
        <div class="stat-content">
          <h3 id="stat-memory">-</h3>
          <p>Memory Usage</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon warning">
          <i class="fas fa-microchip"></i>
        </div>
        <div class="stat-content">
          <h3 id="stat-cpu">-</h3>
          <p>CPU Usage</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon danger">
          <i class="fas fa-cloud"></i>
        </div>
        <div class="stat-content">
          <h3 id="stat-configs">-</h3>
          <p>Cloud-Init Configs</p>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">System Information</h3>
        </div>
        <div class="card-body">
          <div id="system-info">
            <div class="spinner"></div> Loading...
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Quick Actions</h3>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <button class="btn btn-primary" onclick="showPage('cloud-init')">
              <i class="fas fa-cloud"></i> Manage Cloud-Init
            </button>
            <button class="btn btn-secondary" onclick="showPage('menus')">
              <i class="fas fa-list"></i> Configure Menus
            </button>
            <button class="btn btn-secondary" onclick="updateMenus()">
              <i class="fas fa-sync"></i> Update Boot Menus
            </button>
            <a href="https://netboot.xyz/docs" target="_blank" class="btn btn-secondary">
              <i class="fas fa-book"></i> Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Cloud-Init Page
function renderCloudInit() {
  if (socket) socket.emit('getCloudInitConfigs');
  
  const content = document.getElementById('content');
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; height: calc(100vh - 140px);">
      <!-- Config List -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Configurations -->
        <div class="card" style="flex: 1; display: flex; flex-direction: column;">
          <div class="card-header">
            <h3 class="card-title">Configurations</h3>
            <button class="btn btn-sm btn-secondary" onclick="socket.emit('getCloudInitConfigs')">
              <i class="fas fa-sync"></i>
            </button>
          </div>
          <div class="card-body" style="flex: 1; overflow-y: auto;">
            <div id="config-list">
              <div class="spinner"></div> Loading...
            </div>
          </div>
        </div>
        
        <!-- Templates -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Templates</h3>
          </div>
          <div class="card-body">
            <div id="template-list">
              <!-- Templates will be loaded here -->
            </div>
          </div>
        </div>
        
        <!-- AI Assistant -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-robot"></i> AI Assistant
            </h3>
          </div>
          <div class="card-body">
            <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="showAIAssistant()">
              <i class="fas fa-magic"></i> Get Help with Cloud-Init
            </button>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
              Ask questions about cloud-init syntax, get examples, or debug your configurations.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Editor -->
      <div class="editor-container" id="editor-panel" style="display: none; flex-direction: column;">
        <div class="editor-header">
          <div class="editor-title">
            <i class="fas fa-file-code"></i>
            <span id="editor-filename">Select a configuration</span>
          </div>
          <div class="editor-actions">
            <button class="btn btn-sm btn-secondary" onclick="insertSnippet()">
              <i class="fas fa-code"></i> Snippets
            </button>
            <button class="btn btn-sm btn-secondary" onclick="validateYAML()">
              <i class="fas fa-check"></i> Validate
            </button>
            <button class="btn btn-sm btn-success" onclick="saveCloudInitConfig()">
              <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteCloudInitConfig()">
              <i class="fas fa-trash"></i> Delete
            </button>
            <button class="btn btn-sm btn-secondary" onclick="copyCloudInitUrl()">
              <i class="fas fa-link"></i> Copy URL
            </button>
          </div>
        </div>
        
        <!-- Documentation Panel -->
        <div id="doc-panel" style="background: var(--bg-tertiary); border-bottom: 1px solid var(--border-dim); padding: 1rem; display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h5 style="margin: 0; color: var(--primary); font-family: 'Orbitron', monospace;">
              <i class="fas fa-info-circle"></i> Quick Help
            </h5>
            <button class="btn btn-sm btn-secondary" onclick="toggleDocPanel()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="doc-content" style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
            <!-- Dynamic help content will appear here -->
          </div>
        </div>
        
        <div id="cloud-init-editor" style="flex: 1;"></div>
        
        <div style="padding: 1rem; background: var(--bg-tertiary); border-top: 1px solid var(--border-dim);">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <span style="color: var(--text-secondary); font-size: 0.875rem;">User-data URL:</span>
            <code id="userdata-url" style="flex: 1; padding: 0.5rem; background: var(--bg-primary); border-radius: 0.25rem; font-size: 0.8125rem;">-</code>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div id="cloud-init-empty" class="card" style="display: flex; align-items: center; justify-content: center; text-align: center;">
        <div class="card-body">
          <i class="fas fa-cloud" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem; display: block;"></i>
          <h3 style="color: var(--text-secondary); margin-bottom: 0.5rem;">No Configuration Selected</h3>
          <p style="color: var(--text-muted);">Select a configuration or create a new one to get started</p>
        </div>
      </div>
    </div>
  `;
}

// Menus Page
function renderMenus() {
  if (socket) socket.emit('getconfig');
  
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>File</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="menu-list">
          <tr>
            <td colspan="4" style="text-align: center;">
              <div class="spinner"></div> Loading...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// Assets Page
function renderAssets() {
  if (socket) socket.emit('getlocal');
  
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Local Asset Management</h3>
      </div>
      <div class="card-body">
        <div id="assets-content">
          <div class="spinner"></div> Loading...
        </div>
      </div>
    </div>
  `;
}

// iPXE Scripts Page
function renderIPXE() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">iPXE Script Library</h3>
      </div>
      <div class="card-body">
        <p style="color: var(--text-secondary);">
          Custom iPXE scripts and boot configurations will appear here.
        </p>
        <p style="color: var(--text-muted); font-size: 0.875rem;">
          You can create custom boot sequences, chainload configurations, and advanced iPXE scripts.
        </p>
      </div>
    </div>
  `;
}

// Logs Page
function renderLogs() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">System Logs</h3>
        <div>
          <select class="form-control" style="width: 200px; display: inline-block;" onchange="filterLogs(this.value)">
            <option value="all">All Logs</option>
            <option value="tftp">TFTP Server</option>
            <option value="nginx">Web Server</option>
            <option value="app">Application</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.875rem; height: 500px; overflow-y: auto;">
          <div style="color: var(--text-muted);">
            [2024-06-04 12:00:00] INFO: netboot.xyz Studio started<br>
            [2024-06-04 12:00:01] INFO: TFTP server listening on port 69<br>
            [2024-06-04 12:00:01] INFO: Web server listening on port 80<br>
            [2024-06-04 12:00:02] INFO: Application ready on port 3000<br>
            [2024-06-04 12:00:05] INFO: Dashboard accessed by client 192.168.1.100<br>
            [2024-06-04 12:00:10] INFO: Cloud-init configuration 'web-server.yaml' created<br>
            [2024-06-04 12:00:15] INFO: TFTP request for netboot.xyz.kpxe from 192.168.1.150<br>
            <span style="color: var(--text-secondary);">Logs are displayed in real-time...</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Settings Page
function renderSettings() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <!-- General Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">General Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Theme</label>
            <select class="form-control" onchange="setTheme(this.value)">
              <option value="dark" ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'selected' : ''}>Dark</option>
              <option value="light" ${document.documentElement.getAttribute('data-theme') === 'light' ? 'selected' : ''}>Light</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Language</label>
            <select class="form-control">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" checked> Enable toast notifications
            </label>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" checked> Auto-save configurations
            </label>
          </div>
        </div>
      </div>
      
      <!-- Network Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Network Settings</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">TFTP Port</label>
            <input type="text" class="form-control" value="69" readonly>
          </div>
          
          <div class="form-group">
            <label class="form-label">HTTP Port</label>
            <input type="text" class="form-control" value="80" readonly>
          </div>
          
          <div class="form-group">
            <label class="form-label">Web UI Port</label>
            <input type="text" class="form-control" value="3000" readonly>
          </div>
          
          <button class="btn btn-primary">Save Settings</button>
        </div>
      </div>
      
      <!-- About -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">About</h3>
        </div>
        <div class="card-body">
          <h4>netboot.xyz Studio</h4>
          <p>Version: <strong>2.0.0</strong></p>
          <p>A modern interface for PXE boot and cloud-init management.</p>
          
          <div style="margin-top: 1rem;">
            <a href="https://github.com/netbootxyz/netboot.xyz" target="_blank" class="btn btn-secondary">
              <i class="fab fa-github"></i> GitHub
            </a>
            <a href="https://netboot.xyz/docs" target="_blank" class="btn btn-secondary">
              <i class="fas fa-book"></i> Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon();
  showToast(`Theme changed to ${theme} mode`);
}

function filterLogs(type) {
  showToast(`Filtering logs: ${type}`, 'info');
}

// Helper Functions
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
  
  const icon = document.querySelector('.sidebar-toggle i');
  icon.className = sidebar.classList.contains('collapsed') ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  
  // Save state
  localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme');
  const icon = document.querySelector('[onclick="toggleTheme()"] i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type]} toast-icon"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

function showModal(title, body, actions) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  
  if (actions) {
    document.getElementById('modal-footer').innerHTML = actions;
  }
  
  document.getElementById('modal').classList.add('show');
}

// Cloud-Init Functions
function createCloudInitConfig() {
  let templateOptions = '<option value="">Blank Configuration</option>';
  Object.keys(templates).forEach(template => {
    templateOptions += `<option value="${template}">${template}</option>`;
  });
  
  showModal('Create New Configuration', `
    <div class="form-group">
      <label class="form-label">Configuration Name</label>
      <input type="text" class="form-control" id="new-config-name" placeholder="my-config.yaml">
    </div>
    <div class="form-group">
      <label class="form-label">Start from Template</label>
      <select class="form-control" id="template-select">
        ${templateOptions}
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="doCreateCloudInitConfig()">Create</button>
  `);
  
  document.getElementById('new-config-name').focus();
}

function doCreateCloudInitConfig() {
  const name = document.getElementById('new-config-name').value.trim();
  const template = document.getElementById('template-select').value;
  
  if (!name) {
    showToast('Please enter a configuration name', 'error');
    return;
  }
  
  let configName = name;
  if (!name.endsWith('.yaml') && !name.endsWith('.yml')) {
    configName = name + '.yaml';
  }
  
  if (template) {
    socket.emit('createCloudInitFromTemplate', configName, template);
  } else {
    socket.emit('saveCloudInitConfig', configName, '#cloud-config\n# New cloud-init configuration\n');
  }
  
  closeModal();
}

function loadCloudInitConfig(filename) {
  currentConfig = filename;
  socket.emit('getCloudInitConfig', filename);
}

function saveCloudInitConfig() {
  if (!currentConfig || !editors.cloudInit) return;
  
  const content = editors.cloudInit.getValue();
  socket.emit('saveCloudInitConfig', currentConfig, content);
}

function deleteCloudInitConfig() {
  if (!currentConfig) return;
  
  if (confirm(`Are you sure you want to delete ${currentConfig}?`)) {
    socket.emit('deleteCloudInitConfig', currentConfig);
  }
}

function copyCloudInitUrl() {
  const url = document.getElementById('userdata-url').textContent;
  navigator.clipboard.writeText(url).then(() => {
    showToast('URL copied to clipboard!');
  });
}

// Menu Functions
function createMenu() {
  showModal('Create New Menu', `
    <div class="form-group">
      <label class="form-label">Menu Name</label>
      <input type="text" class="form-control" id="new-menu-name" placeholder="custom.ipxe">
    </div>
    <div class="form-group">
      <label class="form-label">Menu Type</label>
      <select class="form-control" id="menu-type">
        <option value="ipxe">iPXE Menu</option>
        <option value="grub">GRUB Configuration</option>
        <option value="custom">Custom Script</option>
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="doCreateMenu()">Create</button>
  `);
  
  document.getElementById('new-menu-name').focus();
}

function doCreateMenu() {
  const name = document.getElementById('new-menu-name').value.trim();
  
  if (!name) {
    showToast('Please enter a menu name', 'error');
    return;
  }
  
  let menuName = name;
  if (!name.includes('.')) {
    menuName = name + '.ipxe';
  }
  
  socket.emit('createipxe', menuName);
  closeModal();
  showToast(`Menu ${menuName} created successfully!`);
}

function editMenuFile(filename, isLocal) {
  socket.emit('editgetfile', filename, isLocal);
}

function revertMenuFile(filename) {
  if (confirm(`Revert ${filename} to default?`)) {
    socket.emit('revertconfig', filename);
  }
}

function saveMenuFile(filename) {
  if (editors.menuEditor) {
    const content = editors.menuEditor.getValue();
    socket.emit('saveconfig', filename, content);
    closeModal();
    showToast(`${filename} saved successfully!`);
  }
}

// Other Functions
function refreshData() {
  switch(currentPage) {
    case 'dashboard':
      socket.emit('getdash');
      break;
    case 'cloud-init':
      socket.emit('getCloudInitConfigs');
      break;
    case 'menus':
      socket.emit('getconfig');
      break;
    case 'assets':
      socket.emit('getlocal');
      break;
  }
  
  showToast('Data refreshed');
}

function updateMenus() {
  if (confirm('Update boot menus to the latest version?')) {
    showToast('Updating menus... This may take a moment.');
    socket.emit('upgrademenus', 'latest');
  }
}

function headerAction() {
  // Placeholder for dynamic header action
}

function performGlobalSearch(query) {
  if (!query) {
    // Clear search highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      el.classList.remove('search-highlight');
    });
    return;
  }
  
  // Add visual feedback (this could be expanded to actually filter content)
  showToast(`Searching for: ${query}`, 'info');
}

function deleteAsset(asset) {
  if (confirm(`Delete asset: ${asset}?`)) {
    socket.emit('deletelocal', [asset]);
    showToast(`Asset ${asset} deleted`);
  }
}

function browseRemoteAssets() {
  showToast('Remote asset browser coming soon!', 'info');
}

// Socket Event Handler Setup
function setupSocketHandlers() {
  socket.on('renderdash', function(dashinfo) {
    // Update stats
    if (document.getElementById('stat-version')) {
      document.getElementById('stat-version').textContent = dashinfo.menuversion;
    }
    if (document.getElementById('stat-memory')) {
      document.getElementById('stat-memory').textContent = Math.round(dashinfo.mem.used / dashinfo.mem.total * 100) + '%';
    }
    if (document.getElementById('stat-cpu')) {
      document.getElementById('stat-cpu').textContent = Math.round(dashinfo.CPUpercent) + '%';
    }
    
    // Count cloud-init configs
    socket.emit('getCloudInitConfigs');
    
    // Update system info
    const systemInfo = document.getElementById('system-info');
    if (systemInfo) {
      systemInfo.innerHTML = `
        <div style="display: grid; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Web Version:</span>
            <span>${dashinfo.webversion}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Menu Version:</span>
            <span>${dashinfo.menuversion} ${dashinfo.remotemenuversion && dashinfo.remotemenuversion !== dashinfo.menuversion ? `<span style="color: var(--warning);">(Update available: ${dashinfo.remotemenuversion})</span>` : ''}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">CPU Model:</span>
            <span>${dashinfo.cpu.model}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">CPU Cores:</span>
            <span>${dashinfo.cpu.cores}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Total Memory:</span>
            <span>${Math.round(dashinfo.mem.total / 1024 / 1024 / 1024 * 10) / 10} GB</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">TFTP Server:</span>
            <span>${dashinfo.tftpversion.split('\\n')[0]}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Web Server:</span>
            <span>${dashinfo.nginxversion.replace('nginx version: ', '')}</span>
          </div>
        </div>
      `;
    }
  });

  socket.on('renderCloudInitConfigs', function(configList, templateList) {
    // Update config count on dashboard
    if (document.getElementById('stat-configs')) {
      document.getElementById('stat-configs').textContent = configList.length;
    }
    
    // Store data
    configList.forEach(name => {
      if (!configs[name]) {
        configs[name] = { name: name };
      }
    });
    
    templateList.forEach(name => {
      templates[name] = true;
    });
    
    // Render config list if on cloud-init page
    const configListEl = document.getElementById('config-list');
    if (configListEl) {
      configListEl.innerHTML = '';
      
      if (configList.length === 0) {
        configListEl.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No configurations found</p>';
      } else {
        configList.forEach(config => {
          const item = document.createElement('div');
          item.style.cssText = `
            padding: 1rem;
            background: var(--bg-tertiary);
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          `;
          
          item.innerHTML = `
            <i class="fas fa-file-code" style="color: var(--primary);"></i>
            <div style="flex: 1;">
              <div style="font-weight: 500;">${config}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Cloud-init configuration</div>
            </div>
          `;
          
          item.onclick = () => loadCloudInitConfig(config);
          item.onmouseover = () => item.style.background = 'var(--bg-card)';
          item.onmouseout = () => item.style.background = 'var(--bg-tertiary)';
          
          if (config === currentConfig) {
            item.style.background = 'var(--bg-card)';
            item.style.border = '1px solid var(--primary)';
          }
          
          configListEl.appendChild(item);
        });
      }
    }
    
    // Render template list
    const templateListEl = document.getElementById('template-list');
    if (templateListEl) {
      templateListEl.innerHTML = '';
      
      templateList.forEach(template => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 0.375rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        `;
        
        item.innerHTML = `
          <i class="fas fa-file-alt" style="color: var(--info);"></i>
          <span>${template}</span>
        `;
        
        templateListEl.appendChild(item);
      });
    }
  });

  socket.on('renderconfig', function(remote_files, local_files) {
    const menuList = document.getElementById('menu-list');
    if (!menuList) return;
    
    menuList.innerHTML = '';
    
    // Combine and sort files
    const allFiles = [...new Set([...remote_files, ...local_files])].sort();
    
    allFiles.forEach(file => {
      const isLocal = local_files.includes(file);
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>
          <i class="fas fa-file-code" style="color: ${isLocal ? 'var(--success)' : 'var(--primary)'};"></i>
          ${file}
        </td>
        <td>${file.endsWith('.ipxe') ? 'iPXE Menu' : 'Configuration'}</td>
        <td>
          <span style="color: ${isLocal ? 'var(--success)' : 'var(--text-secondary)'};">
            ${isLocal ? 'Modified' : 'Default'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editMenuFile('${file}', ${isLocal})">
            <i class="fas fa-edit"></i> Edit
          </button>
          ${isLocal ? `
            <button class="btn btn-sm btn-danger" onclick="revertMenuFile('${file}')">
              <i class="fas fa-undo"></i> Revert
            </button>
          ` : ''}
        </td>
      `;
      
      menuList.appendChild(tr);
    });
  });

  // Cloud-Init Socket Handlers
  socket.on('renderCloudInitConfig', function(filename, content) {
    currentConfig = filename;
    
    // Show editor, hide empty state
    document.getElementById('editor-panel').style.display = 'flex';
    document.getElementById('cloud-init-empty').style.display = 'none';
    
    // Update filename
    document.getElementById('editor-filename').textContent = filename;
    
    // Initialize or update editor
    if (!editors.cloudInit) {
      editors.cloudInit = CodeMirror(document.getElementById('cloud-init-editor'), {
        mode: 'yaml',
        theme: 'material-ocean',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        extraKeys: {
          "Ctrl-Space": "autocomplete",
          "Tab": function(cm) {
            if (cm.somethingSelected()) {
              cm.indentSelection("add");
            } else {
              cm.replaceSelection("  ", "end");
            }
          }
        },
        hintOptions: {
          completeSingle: false,
          completeOnSingleClick: false,
          hint: cloudInitHints
        }
      });
      
      // Add change listener for contextual help
      editors.cloudInit.on("cursorActivity", function(cm) {
        updateContextualHelp(cm);
      });
    }
    
    editors.cloudInit.setValue(content || '');
    
    // Update URL
    const baseUrl = window.location.origin + baseurl;
    document.getElementById('userdata-url').textContent = `${baseUrl}cloud-init/user-data/${filename}`;
  });

  socket.on('cloudInitSaved', function(filename, configs) {
    showToast(`Configuration ${filename} saved successfully!`);
    socket.emit('getCloudInitConfigs');
  });

  socket.on('cloudInitDeleted', function(filename, configs) {
    showToast(`Configuration ${filename} deleted successfully!`);
    currentConfig = null;
    document.getElementById('editor-panel').style.display = 'none';
    document.getElementById('cloud-init-empty').style.display = 'flex';
    socket.emit('getCloudInitConfigs');
  });

  socket.on('cloudInitCreated', function(filename, configs) {
    showToast(`Configuration ${filename} created successfully!`);
    socket.emit('getCloudInitConfigs');
    loadCloudInitConfig(filename);
  });

  socket.on('cloudInitError', function(error) {
    showToast(error, 'error');
  });

  // Assets Socket Handlers
  socket.on('renderlocal', function(endpoints, assets, remotemenuversion) {
    const assetsContent = document.getElementById('assets-content');
    if (!assetsContent) return;
    
    let html = '';
    
    if (assets && assets.length > 0) {
      html += `
        <h5 style="margin-bottom: 1rem;">Downloaded Assets (${assets.length})</h5>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      assets.forEach(asset => {
        html += `
          <tr>
            <td><i class="fas fa-file"></i> ${asset}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="deleteAsset('${asset}')">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        `;
      });
      
      html += `
            </tbody>
          </table>
        </div>
      `;
    } else {
      html = '<p style="text-align: center; color: var(--text-muted);">No local assets downloaded yet.</p>';
    }
    
    html += `
      <div style="margin-top: 2rem;">
        <h5>Available Remote Assets</h5>
        <p style="color: var(--text-secondary);">
          Browse and download boot images, ISOs, and other assets from the netboot.xyz repository.
        </p>
        <button class="btn btn-primary" onclick="browseRemoteAssets()">
          <i class="fas fa-globe"></i> Browse Remote Assets
        </button>
      </div>
    `;
    
    assetsContent.innerHTML = html;
  });

  // Handle menu file editing
  socket.on('editrenderfile', function(content, filename, isLocal) {
    currentFile = filename;
    
    showModal(`Edit: ${filename}`, `
      <div class="editor-container" style="height: 500px;">
        <div id="menu-editor" style="height: 100%;"></div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveMenuFile('${filename}')">Save</button>
    `);
    
    // Initialize editor
    const editor = CodeMirror(document.getElementById('menu-editor'), {
      value: content,
      mode: 'shell',
      theme: 'material-ocean',
      lineNumbers: true,
      lineWrapping: true
    });
    
    editors.menuEditor = editor;
  });
}

// Cloud-Init Autocomplete
function cloudInitHints(cm) {
  const cursor = cm.getCursor();
  const line = cm.getLine(cursor.line);
  const start = cursor.ch;
  const end = cursor.ch;
  
  const hints = {
    list: [],
    from: CodeMirror.Pos(cursor.line, start),
    to: CodeMirror.Pos(cursor.line, end)
  };
  
  // Cloud-init top-level keys
  const topLevelKeys = [
    { text: "#cloud-config\n", displayText: "#cloud-config - Required header" },
    { text: "users:\n  - ", displayText: "users - Define system users" },
    { text: "packages:\n  - ", displayText: "packages - Install packages" },
    { text: "runcmd:\n  - ", displayText: "runcmd - Run commands" },
    { text: "write_files:\n  - ", displayText: "write_files - Create files" },
    { text: "ssh_authorized_keys:\n  - ", displayText: "ssh_authorized_keys - Add SSH keys" },
    { text: "hostname: ", displayText: "hostname - Set hostname" },
    { text: "timezone: ", displayText: "timezone - Set timezone" },
    { text: "locale: ", displayText: "locale - Set locale" },
    { text: "apt:\n  ", displayText: "apt - APT configuration" },
    { text: "snap:\n  ", displayText: "snap - Snap packages" },
    { text: "bootcmd:\n  - ", displayText: "bootcmd - Early boot commands" },
    { text: "mounts:\n  - ", displayText: "mounts - Mount filesystems" }
  ];
  
  // Context-aware suggestions
  if (line.trim() === "" && cursor.ch === 0) {
    hints.list = topLevelKeys;
  } else if (line.includes("users:")) {
    hints.list = [
      { text: "name: ", displayText: "name - Username" },
      { text: "gecos: ", displayText: "gecos - User description" },
      { text: "groups: ", displayText: "groups - User groups" },
      { text: "sudo: ALL=(ALL) NOPASSWD:ALL", displayText: "sudo - Grant sudo access" },
      { text: "shell: /bin/bash", displayText: "shell - User shell" },
      { text: "ssh_authorized_keys:\n      - ", displayText: "ssh_authorized_keys - SSH keys" }
    ];
  } else if (line.includes("write_files:")) {
    hints.list = [
      { text: "path: ", displayText: "path - File path" },
      { text: "content: |\n      ", displayText: "content - File content" },
      { text: "owner: ", displayText: "owner - File owner" },
      { text: "permissions: '0644'", displayText: "permissions - File permissions" },
      { text: "encoding: b64", displayText: "encoding - Content encoding" }
    ];
  }
  
  return hints;
}

// Show snippets modal
function insertSnippet() {
  const snippets = [
    {
      name: "Basic Web Server",
      description: "Install and configure Nginx web server",
      content: `packages:
  - nginx
  - certbot

runcmd:
  - systemctl enable nginx
  - systemctl start nginx`
    },
    {
      name: "Docker Host",
      description: "Install Docker and Docker Compose",
      content: `packages:
  - apt-transport-https
  - ca-certificates
  - curl
  - gnupg
  - lsb-release

runcmd:
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
  - add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  - apt-get update
  - apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose
  - usermod -aG docker ubuntu`
    },
    {
      name: "SSH Hardening",
      description: "Secure SSH configuration",
      content: `write_files:
  - path: /etc/ssh/sshd_config.d/hardening.conf
    content: |
      PermitRootLogin no
      PasswordAuthentication no
      PubkeyAuthentication yes
      ChallengeResponseAuthentication no
      UsePAM yes
      X11Forwarding no
      PrintMotd no
      AcceptEnv LANG LC_*
      Subsystem sftp /usr/lib/openssh/sftp-server

runcmd:
  - systemctl restart sshd`
    },
    {
      name: "System Updates",
      description: "Update system packages",
      content: `package_update: true
package_upgrade: true
package_reboot_if_required: true`
    }
  ];
  
  let snippetHTML = '<div style="display: grid; gap: 1rem;">';
  snippets.forEach((snippet, index) => {
    snippetHTML += `
      <div style="padding: 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-dim); border-radius: 0.25rem; cursor: pointer;"
           onmouseover="this.style.borderColor='var(--primary)'; this.style.boxShadow='var(--glow-sm)'"
           onmouseout="this.style.borderColor='var(--border-dim)'; this.style.boxShadow='none'"
           onclick="applySnippet(${index})">
        <h5 style="color: var(--primary); margin: 0 0 0.5rem 0;">${snippet.name}</h5>
        <p style="color: var(--text-secondary); margin: 0 0 0.5rem 0; font-size: 0.875rem;">${snippet.description}</p>
        <pre style="background: var(--bg-primary); padding: 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; color: var(--text-muted); margin: 0;"><code>${snippet.content.substring(0, 100)}...</code></pre>
      </div>
    `;
  });
  snippetHTML += '</div>';
  
  showModal('Insert Cloud-Init Snippet', snippetHTML, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
  `);
  
  // Store snippets globally for applySnippet function
  window.cloudInitSnippets = snippets;
}

// Apply selected snippet
function applySnippet(index) {
  if (editors.cloudInit && window.cloudInitSnippets) {
    const snippet = window.cloudInitSnippets[index];
    const cursor = editors.cloudInit.getCursor();
    editors.cloudInit.replaceRange("\n" + snippet.content + "\n", cursor);
    closeModal();
    showToast(`Inserted ${snippet.name} snippet`);
  }
}

// Validate YAML
function validateYAML() {
  if (!editors.cloudInit) return;
  
  const content = editors.cloudInit.getValue();
  try {
    // Basic YAML validation
    const parsed = jsyaml.load(content);
    
    // Check for cloud-config header
    if (!content.startsWith('#cloud-config')) {
      showToast('Warning: Missing #cloud-config header', 'warning');
      return;
    }
    
    // Validate structure
    const validKeys = ['users', 'packages', 'runcmd', 'write_files', 'ssh_authorized_keys', 
                      'hostname', 'timezone', 'locale', 'apt', 'snap', 'bootcmd', 'mounts',
                      'package_update', 'package_upgrade', 'package_reboot_if_required'];
    
    const unknownKeys = Object.keys(parsed).filter(key => !validKeys.includes(key));
    if (unknownKeys.length > 0) {
      showToast(`Unknown keys: ${unknownKeys.join(', ')}`, 'warning');
    } else {
      showToast('YAML is valid!', 'success');
    }
  } catch (e) {
    showToast(`YAML Error: ${e.message}`, 'error');
  }
}

// Update contextual help based on cursor position
function updateContextualHelp(cm) {
  const cursor = cm.getCursor();
  const line = cm.getLine(cursor.line);
  const docPanel = document.getElementById('doc-panel');
  const docContent = document.getElementById('doc-content');
  
  let helpText = '';
  
  if (line.includes('users:')) {
    helpText = `
      <strong>users:</strong> Define system users
      <br><br>
      Common properties:
      <ul style="margin: 0.5rem 0;">
        <li><code>name</code> - Username (required)</li>
        <li><code>gecos</code> - User description</li>
        <li><code>groups</code> - Comma-separated groups</li>
        <li><code>sudo</code> - Sudo privileges</li>
        <li><code>shell</code> - User shell (default: /bin/bash)</li>
        <li><code>ssh_authorized_keys</code> - SSH public keys</li>
      </ul>
    `;
  } else if (line.includes('packages:')) {
    helpText = `
      <strong>packages:</strong> List of packages to install
      <br><br>
      Example:
      <pre style="background: var(--bg-primary); padding: 0.5rem; margin: 0.5rem 0;">packages:
  - nginx
  - postgresql
  - python3-pip</pre>
    `;
  } else if (line.includes('runcmd:')) {
    helpText = `
      <strong>runcmd:</strong> Commands to run after boot
      <br><br>
      • Runs after package installation<br>
      • Each command is a list item<br>
      • Commands run in order<br>
      • Use full paths for safety
    `;
  } else if (line.includes('write_files:')) {
    helpText = `
      <strong>write_files:</strong> Create or modify files
      <br><br>
      Required fields:
      <ul style="margin: 0.5rem 0;">
        <li><code>path</code> - File location</li>
        <li><code>content</code> - File contents</li>
      </ul>
      Optional:
      <ul style="margin: 0.5rem 0;">
        <li><code>owner</code> - user:group</li>
        <li><code>permissions</code> - Octal mode</li>
        <li><code>encoding</code> - b64, gz, or text</li>
      </ul>
    `;
  }
  
  if (helpText) {
    docContent.innerHTML = helpText;
    docPanel.style.display = 'block';
  }
}

// Toggle documentation panel
function toggleDocPanel() {
  const panel = document.getElementById('doc-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Show AI Assistant
function showAIAssistant() {
  // For now, we'll use a prompt for the API key. 
  // In a future version, we can store this in settings.
  const apiKey = prompt("Please enter your Open WebUI API Key (Settings > Account):");
  if (!apiKey) {
    showToast("API Key is required to use the AI Assistant.", 'warning');
    return;
  }
  
  showModal('AI Cloud-Init Assistant', `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <p style="color: var(--text-secondary);">
        Ask me anything about cloud-init configurations, best practices, or troubleshooting.
      </p>
      <textarea 
        id="ai-question" 
        class="form-control" 
        rows="4" 
        placeholder="Example: How do I create a user with sudo access and add SSH keys?"
        style="resize: vertical;"
      ></textarea>
      <div id="ai-response" style="display: none; margin-top: 1rem;">
        <h5 style="color: var(--primary); margin-bottom: 0.5rem;">AI Response:</h5>
        <div id="ai-response-content" style="background: var(--bg-tertiary); padding: 1rem; border-radius: 0.25rem; max-height: 300px; overflow-y: auto;">
          <!-- Response will appear here -->
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    <button class="btn btn-primary" onclick="askAI('${apiKey}')">
      <i class="fas fa-robot"></i> Ask AI
    </button>
  `);
  
  document.getElementById('ai-question').focus();
}

// Ask AI
async function askAI(apiKey) {
  const questionInput = document.getElementById('ai-question');
  const question = questionInput.value;
  if (!question) {
    showToast('Please enter a question', 'error');
    return;
  }
  
  const responseDiv = document.getElementById('ai-response');
  const responseContent = document.getElementById('ai-response-content');
  
  // Show loading
  responseContent.innerHTML = '<div class="spinner"></div> Thinking...';
  responseDiv.style.display = 'block';
  
  // Clear previous response
  responseContent.innerHTML = '';

  try {
    // Use a default model for now. This could be configurable later.
    const model = "llama3.1"; // Replace with a valid model name from your Open WebUI instance
    const apiUrl = `${window.location.origin}/api/chat/completions`; // Assuming Open WebUI is on the same host/port
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{
          role: "user",
          content: question
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Display the AI's response
    if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
      // Assuming the response content is markdown, render it
      responseContent.innerHTML = marked.parse(data.choices[0].message.content);
    } else {
      responseContent.innerHTML = '<span style="color: var(--text-muted);">No response from AI.</span>';
    }

  } catch (error) {
    console.error('AI Assistant Error:', error);
    responseContent.innerHTML = `<span style="color: var(--danger);">Error: ${error.message}</span>`;
    showToast(`AI Error: ${error.message}`, 'error');
  }
}

// Add jsyaml for validation (include this in your HTML)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script> 