// Cloud-init patch for netboot.xyz
// This file adds cloud-init functionality to the existing app

const CloudInitHandler = require('./cloud-init-handler.js');
const cloudInit = new CloudInitHandler();

module.exports = function(app, io, baserouter, baseurl) {
  const express = require('express');
  const yaml = require('js-yaml');
  
  console.log('[cloud-init] Patching app with cloud-init support...');
  
  // Add cloud-init routes
  baserouter.get("/cloud-init", function (req, res) {
    res.render(__dirname + '/../public/cloud-init.ejs', {baseurl: baseurl});
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
  const originalConnection = io._events.connection;
  io.on('connection', function(socket) {
    // Call original connection handler if it exists
    if (originalConnection) {
      if (Array.isArray(originalConnection)) {
        originalConnection.forEach(handler => handler.call(io, socket));
      } else {
        originalConnection.call(io, socket);
      }
    }
    
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
}; 