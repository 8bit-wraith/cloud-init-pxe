#!/bin/bash

# Setup cloud-init support in netboot.xyz

echo "[cloud-init] Setting up cloud-init support..."

# Create a patch for app.js that adds cloud-init routes
cat > /tmp/cloud-init-patch.js << 'EOF'

// Cloud-init support
(function() {
  const CloudInitHandler = require('/app/cloud-init-handler.js');
  const cloudInit = new CloudInitHandler();
  const yaml = require('js-yaml');
  const path = require('path');
  
  // Override the default root route with modern interface
  // Remove the old route first
  const routes = baserouter.stack.filter(layer => layer.route);
  const rootRouteIndex = routes.findIndex(r => r.route.path === '/' && r.route.methods.get);
  if (rootRouteIndex !== -1) {
    baserouter.stack.splice(baserouter.stack.indexOf(routes[rootRouteIndex]), 1);
  }
  
  // Add new unified modern interface as default
  baserouter.get("/", function (req, res) {
    res.render(path.join(__dirname, '/public/unified-app.ejs'), {baseurl: baseurl});
  });
  
  // Keep legacy interface at /legacy
  baserouter.get("/legacy", function (req, res) {
    res.render(path.join(__dirname, '/public/index.ejs'), {baseurl: baseurl});
  });
  
  // Redirects for old cloud-init routes
  baserouter.get("/cloud-init", function (req, res) {
    res.redirect(baseurl);
  });
  
  baserouter.get("/cloud-init-studio", function (req, res) {
    res.redirect(baseurl);
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
})();

EOF

# Find and comment out the original root route, then add our patch
if [ -f /app/app.js ]; then
  # Make a backup
  cp /app/app.js /app/app.js.original
  
  # Create a modified version that comments out the original root route
  awk '
    /^baserouter\.get\("\/", function \(req, res\) \{$/ {
      print "// Original root route commented out by cloud-init setup"
      print "// " $0
      in_route = 1
      next
    }
    in_route && /^\}\);$/ {
      print "// " $0
      in_route = 0
      next
    }
    in_route {
      print "// " $0
      next
    }
    /^app\.use\(baseurl, baserouter\);$/ {
      # Insert our patch before this line
      system("cat /tmp/cloud-init-patch.js")
      print ""
    }
    {print}
  ' /app/app.js > /app/app.js.tmp
  
  # Replace the original file
  mv /app/app.js.tmp /app/app.js
  
  echo "[cloud-init] Successfully patched app.js"
else
  echo "[cloud-init] ERROR: app.js not found!"
  exit 1
fi 