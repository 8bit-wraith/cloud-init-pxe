# netboot.xyz Studio Release Notes

## v2.0.0 - Complete UI Overhaul (2024-06-04)

### 🎉 Features

#### Unified Modern Interface
- **Complete UI Overhaul**: Beautiful, modern interface that replaces the dated netboot.xyz UI
- **Single Unified Experience**: All features in one cohesive interface - no more switching between different UIs
- **Dark/Light Theme**: Gorgeous dark theme by default with smooth light theme option
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices

#### Core Functionality
- **Dashboard**: Real-time system monitoring with CPU, memory, and version information
- **Boot Menu Management**: Edit and customize iPXE scripts with syntax highlighting
- **Cloud-Init Manager**: Create, edit, and organize cloud-init configurations
- **Asset Management**: Download and manage local boot assets
- **Template Library**: Pre-built templates for common scenarios (basic setup, Kubernetes nodes, Docker hosts)
- **HTTP API**: Serve cloud-init user-data and meta-data via HTTP endpoints
- **iPXE Integration**: Seamless integration between boot menus and cloud-init

#### User Experience
- **Smart Navigation**: Collapsible sidebar that remembers your preferences
- **Global Search**: Quick search across all sections
- **Toast Notifications**: Non-intrusive feedback for all actions
- **One-Click Actions**: Common tasks are just a click away
- **Professional Design**: Modern card-based layout with smooth animations
- **CodeMirror Integration**: Professional code editing for YAML and iPXE scripts

### 🔧 Technical Details

#### Container
- Based on Alpine Linux 3.21.3 for minimal footprint
- Includes all netboot.xyz functionality
- Added Python support for cloud-init tools
- Supervisor for process management

#### Architecture
- Non-invasive patching system that extends the original app
- Modular design for easy maintenance
- Persistent storage for configurations
- Docker Compose ready deployment

### 📋 Requirements
- Docker 20.10+ or Docker Compose v3.8+
- Ports: 3000 (Web UI), 69/UDP (TFTP), 80 (HTTP)
- Minimum 512MB RAM, 1GB storage

### 🚀 Quick Start
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose-cloud-init.yml up -d

# Or build manually
./build-cloud-init.sh
```

### 📍 Access Points
- Classic Interface: http://localhost:3000/cloud-init
- Modern Interface: http://localhost:3000/cloud-init-studio
- Main netboot.xyz: http://localhost:3000

### 🔗 URLs
- User-data: `http://<server>:80/cloud-init/user-data/<config>.yaml`
- Meta-data: `http://<server>:80/cloud-init/meta-data`

### 🙏 Credits
- Built on top of the excellent [netboot.xyz](https://netboot.xyz) project
- Inspired by the need for better cloud-init management in PXE environments

---

### Known Issues
- Documentation is stored in memory and not persisted (will be fixed in v1.1.0)
- No authentication (intended for trusted networks only)

### Future Plans
- Persistent documentation storage
- Configuration versioning
- Import/Export functionality
- Authentication options
- Configuration validation rules 