// Cloud-Init Studio - Modern Interface
let socket = io(window.location.origin, {path: baseurl + 'socket.io'});
let currentConfig = null;
let yamlEditor = null;
let docsEditor = null;
let configs = {};
let templates = {};

// Initialize editors when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeEditors();
  refreshConfigs();
  
  // Handle Enter key in new config name input
  document.getElementById('new-config-name').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      createConfig();
    }
  });
});

// Initialize CodeMirror editors
function initializeEditors() {
  // YAML Editor
  yamlEditor = CodeMirror.fromTextArea(document.getElementById('config-editor'), {
    mode: 'yaml',
    theme: 'dracula',
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false
  });

  // Documentation Editor (Markdown)
  docsEditor = new EasyMDE({
    element: document.getElementById('docs-markdown'),
    spellChecker: false,
    autosave: {
      enabled: false
    },
    toolbar: [
      "bold", "italic", "heading", "|",
      "quote", "unordered-list", "ordered-list", "|",
      "link", "image", "|",
      "code", "table", "|",
      "preview", "side-by-side", "fullscreen", "|",
      "guide"
    ],
    theme: 'dracula',
    status: false,
    renderingConfig: {
      markedOptions: {
        breaks: true
      }
    }
  });

  // Apply dark theme to EasyMDE
  const easyMDEContainer = document.querySelector('.EasyMDEContainer');
  if (easyMDEContainer) {
    easyMDEContainer.style.backgroundColor = '#151932';
    easyMDEContainer.style.borderColor = '#2a2e48';
  }
}

// Load configurations and templates
function refreshConfigs() {
  socket.emit('getCloudInitConfigs');
}

// Switch between tabs
function switchTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('active');
  });
  event.target.closest('.tab').classList.add('active');

  // Update editor views
  document.querySelectorAll('.editor-wrapper').forEach(e => {
    e.classList.remove('active');
  });

  switch(tab) {
    case 'yaml':
      document.getElementById('yaml-editor').classList.add('active');
      yamlEditor.refresh();
      break;
    case 'docs':
      document.getElementById('docs-editor').classList.add('active');
      docsEditor.codemirror.refresh();
      break;
    case 'preview':
      document.getElementById('preview').classList.add('active');
      updatePreview();
      break;
  }
}

// Update markdown preview
function updatePreview() {
  const docsContent = docsEditor.value();
  const yamlContent = yamlEditor.getValue();
  
  let preview = '';
  
  // Add documentation if exists
  if (docsContent) {
    preview += marked.parse(docsContent);
  }
  
  // Add YAML configuration
  preview += '<h2>Configuration</h2>';
  preview += '<pre><code class="language-yaml">' + escapeHtml(yamlContent) + '</code></pre>';
  
  document.getElementById('markdown-preview').innerHTML = preview;
}

// Escape HTML for safe display
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Create new configuration modal
function createNewConfig() {
  document.getElementById('newConfigModal').classList.add('show');
}

// Close modal
function closeModal() {
  document.getElementById('newConfigModal').classList.remove('show');
}

// Create configuration
function createConfig() {
  const name = document.getElementById('new-config-name').value.trim();
  const template = document.getElementById('template-select').value;
  
  if (!name) {
    alert('Please enter a configuration name');
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
  document.getElementById('new-config-name').value = '';
}

// Load configuration into editor
function loadConfig(filename) {
  currentConfig = filename;
  socket.emit('getCloudInitConfig', filename);
}

// Save current configuration
function saveConfig() {
  if (!currentConfig) return;
  
  const yamlContent = yamlEditor.getValue();
  const docsContent = docsEditor.value();
  
  // Store documentation separately
  if (configs[currentConfig]) {
    configs[currentConfig].docs = docsContent;
  }
  
  socket.emit('saveCloudInitConfig', currentConfig, yamlContent);
}

// Delete current configuration
function deleteConfig() {
  if (!currentConfig) return;
  
  if (confirm(`Are you sure you want to delete ${currentConfig}?`)) {
    socket.emit('deleteCloudInitConfig', currentConfig);
  }
}

// Copy URL to clipboard
function copyUrl(elementId) {
  const input = document.getElementById(elementId);
  input.select();
  document.execCommand('copy');
  
  // Show feedback
  const button = input.nextElementSibling;
  const originalContent = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i>';
  setTimeout(() => {
    button.innerHTML = originalContent;
  }, 2000);
}

// Update URLs
function updateUrls(filename) {
  const baseUrl = window.location.origin + baseurl;
  document.getElementById('userdata-url').value = `${baseUrl}cloud-init/user-data/${filename}`;
  document.getElementById('metadata-url').value = `${baseUrl}cloud-init/meta-data`;
}

// Toggle theme
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  
  // Store preference
  localStorage.setItem('theme', newTheme);
}

// Show about dialog
function showAbout() {
  alert(`Cloud-Init Studio v1.0.0
  A modern interface for managing cloud-init configurations with cloud-init-pxe.com.
  

Features:
- Dark/Light theme support
- YAML syntax highlighting
- Markdown documentation
- Live preview
- Template support

Created with ❤️ for the cloud-init-pxe.com community`);
}

// Socket event handlers
socket.on('renderCloudInitConfigs', function(configList, templateList) {
  // Store configs and templates
  configList.forEach(name => {
    if (!configs[name]) {
      configs[name] = { name: name, docs: '' };
    }
  });
  
  templateList.forEach(name => {
    templates[name] = true;
  });
  
  // Render configuration list
  const configListEl = document.getElementById('config-list');
  configListEl.innerHTML = '';
  
  if (configList.length === 0) {
    configListEl.innerHTML = '<div class="empty-state"><p>No configurations found</p></div>';
  } else {
    configList.forEach(config => {
      const item = document.createElement('div');
      item.className = `config-item ${config === currentConfig ? 'active' : ''}`;
      item.onclick = () => loadConfig(config);
      
      const date = configs[config].lastModified || 'Recently';
      
      item.innerHTML = `
        <div class="config-info">
          <div class="config-icon">
            <i class="fas fa-file-code"></i>
          </div>
          <div class="config-details">
            <h4>${config}</h4>
            <p>Modified ${date}</p>
          </div>
        </div>
      `;
      
      configListEl.appendChild(item);
    });
  }
  
  // Render template list
  const templateListEl = document.getElementById('template-list');
  templateListEl.innerHTML = '';
  
  const templateSelect = document.getElementById('template-select');
  templateSelect.innerHTML = '<option value="">Blank Configuration</option>';
  
  templateList.forEach(template => {
    const item = document.createElement('div');
    item.className = 'config-item';
    
    item.innerHTML = `
      <div class="config-info">
        <div class="config-icon" style="background-color: rgba(95, 159, 255, 0.2); color: var(--info);">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="config-details">
          <h4>${template}</h4>
          <p>Template</p>
        </div>
      </div>
    `;
    
    templateListEl.appendChild(item);
    
    const option = document.createElement('option');
    option.value = template;
    option.textContent = template;
    templateSelect.appendChild(option);
  });
});

socket.on('renderCloudInitConfig', function(filename, content) {
  currentConfig = filename;
  
  // Show editor panel, hide empty state
  document.getElementById('editor-panel').style.display = 'block';
  document.getElementById('empty-state').style.display = 'none';
  
  // Update editor
  yamlEditor.setValue(content || '');
  yamlEditor.refresh();
  
  // Load documentation if exists
  if (configs[currentConfig] && configs[currentConfig].docs) {
    docsEditor.value(configs[currentConfig].docs);
  } else {
    docsEditor.value(`# ${filename}\n\nAdd documentation for this cloud-init configuration here.\n\n## Purpose\n\nDescribe what this configuration does.\n\n## Usage\n\nExplain how to use this configuration.\n`);
  }
  
  // Update URLs
  updateUrls(filename);
  
  // Update active state in list
  document.querySelectorAll('.config-item').forEach(item => {
    item.classList.remove('active');
    if (item.querySelector('h4').textContent === filename) {
      item.classList.add('active');
    }
  });
});

socket.on('cloudInitSaved', function(filename, configs) {
  // Show success feedback
  const saveBtn = document.querySelector('.tab[onclick="saveConfig()"]');
  saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
  setTimeout(() => {
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
  }, 2000);
  
  refreshConfigs();
});

socket.on('cloudInitDeleted', function(filename, configs) {
  currentConfig = null;
  document.getElementById('editor-panel').style.display = 'none';
  document.getElementById('empty-state').style.display = 'block';
  refreshConfigs();
});

socket.on('cloudInitCreated', function(filename, configs) {
  refreshConfigs();
  loadConfig(filename);
});

socket.on('cloudInitError', function(error) {
  alert(`Error: ${error}`);
});

// Load theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} 