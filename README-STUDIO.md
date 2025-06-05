# Cloud-Init Studio 🚀

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-Apache%202.0-green.svg" alt="License">
  <img src="https://img.shields.io/badge/docker-ready-brightgreen.svg" alt="Docker Ready">
  <img src="https://img.shields.io/badge/platform-linux%20%7C%20amd64%20%7C%20arm64-lightgrey.svg" alt="Platform">
</p>

<p align="center">
  <strong>A modern, dark-themed interface for managing cloud-init configurations with netboot.xyz</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#contributing">Contributing</a>
</p>

## 🌟 What is Cloud-Init Studio?

Cloud-Init Studio is a complete reimagining of [netboot.xyz](https://netboot.xyz) with a unified, modern interface that combines PXE boot management with powerful cloud-init configuration capabilities. The beautiful dark-themed interface (with light mode option) provides an intuitive experience for managing your network boot environment and cloud-init configurations in one place.

Perfect for:
- 🏢 **Enterprise Deployments**: Manage cloud-init configs for large-scale server deployments
- 🎓 **Homelab Enthusiasts**: Easily configure your servers with consistent settings
- 👨‍💻 **DevOps Teams**: Streamline your infrastructure provisioning workflow
- 🔧 **System Administrators**: Simplify server configuration management

## ✨ Features

### Core Features
- 🎨 **Unified Modern Interface**: One beautiful interface for all netboot.xyz and cloud-init features
- 📊 **Dashboard**: Real-time system stats, quick actions, and status overview
- 📝 **Boot Menu Management**: Edit and customize iPXE boot menus
- ☁️ **Cloud-Init Manager**: Create, edit, and organize cloud-init configurations
- 📦 **Asset Management**: Manage local boot assets and ISOs
- 🎯 **Template Library**: Pre-built templates for common scenarios
- 🌐 **HTTP API**: Serve configurations via standard cloud-init endpoints
- 🔧 **iPXE Integration**: Seamless boot menu and cloud-init integration

### Interface Features
- 🌙 **Dark/Light Theme**: Beautiful dark theme by default with light mode option
- 🎯 **Smart Navigation**: Collapsible sidebar with intuitive organization
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Updates**: WebSocket-powered live updates across all features
- 🔍 **Global Search**: Quick search across menus, configs, and assets
- 📋 **One-Click Actions**: Copy URLs, update menus, and more with single clicks
- 🎨 **Syntax Highlighting**: Beautiful code editors for YAML and iPXE scripts
- 💬 **Toast Notifications**: Non-intrusive feedback for all actions

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cloud-init-studio.git
   cd cloud-init-studio
   ```

2. **Start the container**
   ```bash
   docker-compose -f docker-compose-cloud-init.yml up -d
   ```

3. **Access the unified interface**
   - Main Interface: http://localhost:3000
   - Legacy Interface: http://localhost:3000/legacy (if you prefer the classic look)

### Using Docker CLI

```bash
# Build the image
docker build -f Dockerfile.cloud-init -t cloud-init-studio:latest .

# Run the container
docker run -d \
  --name cloud-init-studio \
  -p 3000:3000 \
  -p 69:69/udp \
  -p 8080:80 \
  -v $(pwd)/config:/config \
  -v $(pwd)/cloud-init-data:/cloud-init \
  --cap-add NET_ADMIN \
  cloud-init-studio:latest
```

## 📖 Documentation

### Creating Your First Configuration

1. **Navigate to Cloud-Init Studio**
   - Open http://localhost:3000/cloud-init-studio in your browser

2. **Create a New Configuration**
   - Click the "New Config" button
   - Give it a name (e.g., `web-server.yaml`)
   - Choose a template or start from scratch

3. **Edit Your Configuration**
   - Use the YAML editor to define your cloud-init settings
   - Switch to the Documentation tab to add markdown notes
   - Preview your work in the Preview tab

4. **Deploy Your Configuration**
   - Copy the user-data URL from the bottom of the editor
   - Use it in your boot parameters or cloud provider

### Example Configuration

```yaml
#cloud-config
# Web Server Configuration

package_update: true
package_upgrade: true

packages:
  - nginx
  - certbot
  - python3-certbot-nginx

users:
  - name: webadmin
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2E... your-key-here

write_files:
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80 default_server;
        root /var/www/html;
        index index.html;
      }

runcmd:
  - systemctl restart nginx
  - ufw allow 'Nginx Full'
```

### Using with iPXE

Add this to your iPXE script:

```ipxe
#!ipxe
set cloud_init_config web-server.yaml
kernel http://archive.ubuntu.com/ubuntu/dists/jammy/main/installer-amd64/current/legacy-images/netboot/ubuntu-installer/amd64/linux
initrd http://archive.ubuntu.com/ubuntu/dists/jammy/main/installer-amd64/current/legacy-images/netboot/ubuntu-installer/amd64/initrd.gz
imgargs linux auto=true cloud-config-url=http://${next-server}/cloud-init/user-data/${cloud_init_config} ds=nocloud-net;s=http://${next-server}/cloud-init/
boot
```

## 🎨 Interface Overview

### Unified Modern Interface
- **Dashboard**: System overview with real-time stats and quick actions
- **Boot Menus**: Manage iPXE scripts and boot configurations
- **Cloud-Init Manager**: Create and edit cloud-init configurations with syntax highlighting
- **Asset Management**: Download and manage boot images and ISOs
- **Dark/Light Theme**: Toggle between beautiful dark and light themes
- **Responsive Sidebar**: Collapsible navigation that adapts to your screen size
- **Toast Notifications**: Non-intrusive feedback for all your actions

### Key Design Elements
- Modern card-based layout with smooth animations
- Consistent color scheme with accent colors for different sections
- Professional typography and spacing
- Intuitive icons and visual hierarchy
- Zero learning curve - everything is where you expect it to be

## 🏗️ Architecture

Cloud-Init Studio is built as a non-invasive extension to netboot.xyz:

```
┌─────────────────────────────────────┐
│         Cloud-Init Studio           │
├─────────────────────────────────────┤
│  Modern UI  │  Classic UI  │  API   │
├─────────────────────────────────────┤
│        Cloud-Init Handler           │
├─────────────────────────────────────┤
│          netboot.xyz Core           │
├─────────────────────────────────────┤
│    Alpine Linux + Node.js + TFTP    │
└─────────────────────────────────────┘
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MENU_VERSION` | latest | netboot.xyz menu version |
| `NGINX_PORT` | 80 | HTTP server port |
| `WEB_APP_PORT` | 3000 | Web UI port |
| `TFTPD_OPTS` | --secure | Additional TFTP options |

### Volumes

| Path | Description |
|------|-------------|
| `/config` | netboot.xyz configuration |
| `/assets` | Downloaded boot assets |
| `/cloud-init` | Cloud-init configurations |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/cloud-init-studio.git
cd cloud-init-studio

# Build and run in development mode
docker-compose -f docker-compose-cloud-init.yml up --build

# Make your changes and test
# The container will need to be rebuilt for backend changes
```

## 📋 Roadmap

- [ ] v1.1.0 - Persistent documentation storage
- [ ] v1.2.0 - Configuration versioning and history
- [ ] v1.3.0 - Import/Export functionality
- [ ] v1.4.0 - Authentication and multi-user support
- [ ] v2.0.0 - Kubernetes operator for cloud-init configs

## 🙏 Acknowledgments

- Built on top of [netboot.xyz](https://netboot.xyz) - Thanks to the amazing team!
- Inspired by the need for better cloud-init tooling
- Dark theme inspired by modern development tools

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Project Homepage](#)
- [Documentation Wiki](#)
- [Issue Tracker](#)
- [Docker Hub](#)

---

<p align="center">Made with ❤️ by the Cloud-Init Studio Team</p> 