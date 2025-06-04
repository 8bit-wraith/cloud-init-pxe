#!/bin/bash

# Setup cloud-init support in netboot.xyz

echo "[cloud-init] Setting up cloud-init support..."

# Create a patch for app.js that adds cloud-init routes
cat > /tmp/cloud-init-patch.js << 'EOF'

// Cloud-init support
(function() {
  const CloudInitHandler = require('/cloud-init/cloud-init-handler.js');
  const cloudInit = new CloudInitHandler();
  const yaml = require('js-yaml');
  const path = require('path');
  
  // Add cloud-init routes
  baserouter.get("/cloud-init", function (req, res) {
    res.render(path.join(__dirname, '/public/cloud-init.ejs'), {baseurl: baseurl});
  });
  
  // Modern cloud-init interface
  baserouter.get("/cloud-init-studio", function (req, res) {
    res.render(path.join(__dirname, '/public/cloud-init-modern.ejs'), {baseurl: baseurl});
  });

  // Serve cloud-init configs
  baserouter.get("/cloud-init/user-data/:filename", function (req, res) {
    const filename = req.params.filename;
    const config = cloudInit.serveConfig(filename);
    if (config) {
      res.setHeader('Content-Type', config.contentType);
      res.send(config.content);
    } else {
      res.status(404).send('Cloud-init configuration not found');
    }
  });

  // Cloud-init meta-data endpoint
  baserouter.get("/cloud-init/meta-data", function (req, res) {
    const metadata = {
      'instance-id': 'iid-' + Date.now(),
      'local-hostname': req.query.hostname || 'netboot-instance'
    };
    res.setHeader('Content-Type', 'text/plain');
    res.send(yaml.dump(metadata));
  });

  // Extend Socket IO events for cloud-init
  io.on('connection', function(socket) {
    // Cloud-init specific events
    socket.on('getCloudInitConfigs', function(){
      const configs = cloudInit.listConfigs();
      const templates = cloudInit.listTemplates();
      io.sockets.in(socket.id).emit('renderCloudInitConfigs', configs, templates);
    });
    
    socket.on('getCloudInitConfig', function(filename){
      const content = cloudInit.getConfig(filename);
      io.sockets.in(socket.id).emit('renderCloudInitConfig', filename, content);
    });
    
    socket.on('saveCloudInitConfig', function(filename, content){
      const result = cloudInit.saveConfig(filename, content);
      if (result.success) {
        const configs = cloudInit.listConfigs();
        io.sockets.in(socket.id).emit('cloudInitSaved', filename, configs);
      } else {
        io.sockets.in(socket.id).emit('cloudInitError', result.error);
      }
    });
    
    socket.on('deleteCloudInitConfig', function(filename){
      const result = cloudInit.deleteConfig(filename);
      if (result.success) {
        const configs = cloudInit.listConfigs();
        io.sockets.in(socket.id).emit('cloudInitDeleted', filename, configs);
      } else {
        io.sockets.in(socket.id).emit('cloudInitError', result.error);
      }
    });
    
    socket.on('createCloudInitFromTemplate', function(filename, templateName){
      const result = cloudInit.createFromTemplate(filename, templateName);
      if (result.success) {
        const configs = cloudInit.listConfigs();
        io.sockets.in(socket.id).emit('cloudInitCreated', filename, configs);
      } else {
        io.sockets.in(socket.id).emit('cloudInitError', result.error);
      }
    });
  });
  
  console.log('[cloud-init] Cloud-init support enabled!');
  
  // Add Cloud-Init links to navigation if exists
  setTimeout(() => {
    const nav = document.querySelector('.navbar-nav.mr-auto');
    if (nav && !document.querySelector('.nav-link[href*="cloud-init"]')) {
      // Add Cloud-Init Classic link
      const cloudInitClassic = document.createElement('li');
      cloudInitClassic.className = 'nav-item active';
      cloudInitClassic.innerHTML = '<a class="nav-link" href="' + baseurl + 'cloud-init">Cloud-Init</a>';
      nav.appendChild(cloudInitClassic);
      
      // Add Cloud-Init Studio link
      const cloudInitStudio = document.createElement('li');
      cloudInitStudio.className = 'nav-item active';
      cloudInitStudio.innerHTML = '<a class="nav-link" href="' + baseurl + 'cloud-init-studio">Studio <span class="badge badge-primary">New</span></a>';
      nav.appendChild(cloudInitStudio);
    }
  }, 1000);
})();

EOF

# Find the line before app.use(baseurl, baserouter); and insert our patch
if [ -f /app/app.js ]; then
  # Make a backup
  cp /app/app.js /app/app.js.original
  
  # Insert the cloud-init patch before app.use(baseurl, baserouter);
  sed -i '/app.use(baseurl, baserouter);/r /tmp/cloud-init-patch.js' /app/app.js
  
  echo "[cloud-init] Successfully patched app.js"
else
  echo "[cloud-init] ERROR: app.js not found!"
  exit 1
fi 