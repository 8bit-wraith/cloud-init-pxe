// Cloud-Init Manager JavaScript
let socket = io(window.location.origin, {path: baseurl + 'socket.io'});
let currentConfig = null;
let editor = null;

// Initialize CodeMirror editor
function initEditor() {
  editor = CodeMirror.fromTextArea(document.getElementById('config-editor'), {
    lineNumbers: true,
    mode: 'yaml',
    theme: 'dracula',
    lineWrapping: true,
    autoCloseBrackets: true,
    matchBrackets: true
  });
}

// Load configurations and templates
function refreshConfigs() {
  socket.emit('getCloudInitConfigs');
}

// Create new configuration modal
function createNewConfig() {
  $('#newConfigModal').modal('show');
}

// Create configuration
function createConfig() {
  const name = $('#new-config-name').val().trim();
  const template = $('#template-select').val();
  
  if (!name) {
    alert('Please enter a configuration name');
    return;
  }
  
  if (!name.endsWith('.yaml') && !name.endsWith('.yml')) {
    $('#new-config-name').val(name + '.yaml');
  }
  
  if (template) {
    socket.emit('createCloudInitFromTemplate', $('#new-config-name').val(), template);
  } else {
    socket.emit('saveCloudInitConfig', $('#new-config-name').val(), '#cloud-config\n# New cloud-init configuration\n');
  }
  
  $('#newConfigModal').modal('hide');
}

// Load configuration into editor
function loadConfig(filename) {
  currentConfig = filename;
  socket.emit('getCloudInitConfig', filename);
}

// Save current configuration
function saveConfig() {
  if (!currentConfig) return;
  
  const content = editor.getValue();
  socket.emit('saveCloudInitConfig', currentConfig, content);
}

// Delete current configuration
function deleteConfig() {
  if (!currentConfig) return;
  
  if (confirm(`Are you sure you want to delete ${currentConfig}?`)) {
    socket.emit('deleteCloudInitConfig', currentConfig);
  }
}

// Copy configuration URL
function copyConfigUrl() {
  const url = $('#userdata-url').val();
  copyToClipboard(url);
}

// Copy URL helper
function copyUrl(elementId) {
  const url = $(`#${elementId}`).val();
  copyToClipboard(url);
}

// Copy to clipboard
function copyToClipboard(text) {
  const temp = $('<input>');
  $('body').append(temp);
  temp.val(text).select();
  document.execCommand('copy');
  temp.remove();
  
  // Show toast or notification
  alert('URL copied to clipboard!');
}

// Update URLs
function updateUrls(filename) {
  const baseUrl = window.location.origin + baseurl;
  $('#userdata-url').val(`${baseUrl}cloud-init/user-data/${filename}`);
  $('#metadata-url').val(`${baseUrl}cloud-init/meta-data`);
  $('#url-card').show();
}

// Socket event handlers
socket.on('renderCloudInitConfigs', function(configs, templates) {
  // Render configuration list
  const configList = $('#config-list');
  configList.empty();
  
  if (configs.length === 0) {
    configList.append('<div class="text-muted text-center p-3">No configurations found</div>');
  } else {
    configs.forEach(config => {
      const item = $(`
        <a href="#" class="list-group-item list-group-item-action ${config === currentConfig ? 'active' : ''}" 
           onclick="loadConfig('${config}'); return false;">
          <i class="fas fa-file-code"></i> ${config}
        </a>
      `);
      configList.append(item);
    });
  }
  
  // Render template list
  const templateList = $('#template-list');
  templateList.empty();
  
  const templateSelect = $('#template-select');
  templateSelect.empty();
  templateSelect.append('<option value="">Blank Configuration</option>');
  
  templates.forEach(template => {
    const item = $(`
      <div class="list-group-item">
        <i class="fas fa-file-alt"></i> ${template}
      </div>
    `);
    templateList.append(item);
    
    templateSelect.append(`<option value="${template}">${template}</option>`);
  });
});

socket.on('renderCloudInitConfig', function(filename, content) {
  currentConfig = filename;
  
  // Update UI
  $('#editor-title').text(`Editing: ${filename}`);
  $('#editor-actions').show();
  $('#editor-placeholder').hide();
  $('#config-editor').show();
  
  // Update editor
  if (!editor) {
    initEditor();
  }
  editor.setValue(content || '');
  editor.refresh();
  
  // Update URLs
  updateUrls(filename);
  
  // Update active state in list
  $('#config-list .list-group-item').removeClass('active');
  $('#config-list .list-group-item').each(function() {
    if ($(this).text().trim() === filename) {
      $(this).addClass('active');
    }
  });
});

socket.on('cloudInitSaved', function(filename, configs) {
  alert(`Configuration ${filename} saved successfully!`);
  refreshConfigs();
  if (filename === currentConfig) {
    loadConfig(filename);
  }
});

socket.on('cloudInitDeleted', function(filename, configs) {
  alert(`Configuration ${filename} deleted successfully!`);
  currentConfig = null;
  $('#editor-title').text('Select a configuration');
  $('#editor-actions').hide();
  $('#url-card').hide();
  $('#editor-placeholder').show();
  if (editor) {
    editor.setValue('');
  }
  refreshConfigs();
});

socket.on('cloudInitCreated', function(filename, configs) {
  refreshConfigs();
  loadConfig(filename);
});

socket.on('cloudInitError', function(error) {
  alert(`Error: ${error}`);
});

// Initialize on page load
$(document).ready(function() {
  refreshConfigs();
  
  // Handle Enter key in new config name input
  $('#new-config-name').keypress(function(e) {
    if (e.which === 13) {
      createConfig();
    }
  });
}); 