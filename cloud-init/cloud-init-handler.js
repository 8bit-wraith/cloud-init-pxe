// Cloud-init configuration handler
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class CloudInitHandler {
  constructor() {
    this.configPath = '/cloud-init/configs';
    this.templatePath = '/cloud-init/templates';
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.configPath)) {
      fs.mkdirSync(this.configPath, { recursive: true });
    }
    if (!fs.existsSync(this.templatePath)) {
      fs.mkdirSync(this.templatePath, { recursive: true });
    }
  }

  // List all cloud-init configurations
  listConfigs() {
    try {
      const files = fs.readdirSync(this.configPath, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory() && (dirent.name.endsWith('.yaml') || dirent.name.endsWith('.yml')))
        .map(dirent => dirent.name);
      return files;
    } catch (error) {
      console.error('Error listing cloud-init configs:', error);
      return [];
    }
  }

  // Get a specific cloud-init configuration
  getConfig(filename) {
    try {
      const filePath = path.join(this.configPath, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return data;
    } catch (error) {
      console.error('Error reading cloud-init config:', error);
      return null;
    }
  }

  // Save a cloud-init configuration
  saveConfig(filename, content) {
    try {
      // Validate YAML syntax
      yaml.load(content);
      
      const filePath = path.join(this.configPath, filename);
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true };
    } catch (error) {
      console.error('Error saving cloud-init config:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a cloud-init configuration
  deleteConfig(filename) {
    try {
      const filePath = path.join(this.configPath, filename);
      fs.unlinkSync(filePath);
      return { success: true };
    } catch (error) {
      console.error('Error deleting cloud-init config:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a new cloud-init configuration from template
  createFromTemplate(filename, templateName) {
    try {
      const templatePath = path.join(this.templatePath, templateName);
      const template = fs.readFileSync(templatePath, 'utf8');
      
      const filePath = path.join(this.configPath, filename);
      fs.writeFileSync(filePath, template, 'utf8');
      return { success: true };
    } catch (error) {
      console.error('Error creating config from template:', error);
      return { success: false, error: error.message };
    }
  }

  // List available templates
  listTemplates() {
    try {
      const files = fs.readdirSync(this.templatePath, { withFileTypes: true })
        .filter(dirent => !dirent.isDirectory() && (dirent.name.endsWith('.yaml') || dirent.name.endsWith('.yml')))
        .map(dirent => dirent.name);
      return files;
    } catch (error) {
      console.error('Error listing templates:', error);
      return [];
    }
  }

  // Serve cloud-init configuration via HTTP endpoint
  serveConfig(filename) {
    try {
      const filePath = path.join(this.configPath, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return { content: data, contentType: 'text/cloud-config' };
    } catch (error) {
      console.error('Error serving cloud-init config:', error);
      return null;
    }
  }
}

module.exports = CloudInitHandler; 