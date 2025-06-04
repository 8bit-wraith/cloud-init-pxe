# Cloud-Init Studio Release Notes

## v1.0.0 - Initial Release (2024-06-04)

### 🎉 Features

#### Core Functionality
- **Cloud-Init Configuration Management**: Create, edit, delete, and organize cloud-init configurations
- **Template Support**: Pre-built templates for common scenarios (basic setup, Kubernetes nodes)
- **YAML Validation**: Real-time syntax validation for cloud-init configurations
- **HTTP API**: Serve cloud-init user-data and meta-data via HTTP endpoints
- **iPXE Integration**: Custom boot menus for cloud-init enabled deployments

#### Modern UI (Cloud-Init Studio)
- **Dark Theme**: Beautiful dark theme by default with light theme option
- **Markdown Documentation**: Document your configurations with integrated markdown editor
- **Live Preview**: See your documentation and configuration in a formatted preview
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Stack**: Built with modern web technologies for fast performance

#### Classic UI
- **Bootstrap Interface**: Familiar interface for existing netboot.xyz users
- **CodeMirror Editor**: Syntax highlighting for YAML files
- **WebSocket Updates**: Real-time updates when configurations change

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