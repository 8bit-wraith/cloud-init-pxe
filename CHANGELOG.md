# Changelog

All notable changes to Cloud-Init Studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-04

### Added
- Initial release of Cloud-Init Studio
- Cloud-init configuration management (create, edit, delete)
- Classic Bootstrap interface for existing netboot.xyz users
- Modern dark-themed "Studio" interface with advanced features
- Markdown documentation support for configurations
- Live preview of documentation and YAML
- Pre-built templates for common scenarios:
  - Basic server setup
  - Kubernetes node configuration
- HTTP API endpoints for cloud-init:
  - User-data: `/cloud-init/user-data/<config>.yaml`
  - Meta-data: `/cloud-init/meta-data`
- iPXE integration with custom boot menus
- WebSocket-based real-time updates
- YAML syntax validation
- One-click URL copying
- Dark/light theme toggle
- Responsive design for mobile and tablet
- Docker and Docker Compose support
- Non-invasive patching system for netboot.xyz
- Persistent storage for configurations

### Technical Details
- Based on Alpine Linux 3.21.3
- Node.js application with Express
- Socket.IO for real-time communication
- CodeMirror for code editing
- EasyMDE for markdown editing
- Supervisor for process management
- TFTP server included (tftp-hpa)

### Known Issues
- Documentation is stored in memory only (not persisted to disk)
- No authentication mechanism (designed for trusted networks)
- Limited to single-user scenarios

### Security
- Configurations are served without authentication
- Intended for use in trusted network environments only

## [Unreleased]

### Planned Features
- Persistent documentation storage
- Configuration versioning and history
- Import/Export functionality
- Authentication and multi-user support
- Configuration validation rules
- Kubernetes operator for cloud-init configs
- API rate limiting
- Audit logging
- Configuration templates marketplace 