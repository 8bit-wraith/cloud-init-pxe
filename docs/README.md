# netboot.xyz Studio Documentation

Welcome to the comprehensive documentation for netboot.xyz Studio - the modern PXE boot and cloud-init management solution.

## 📚 Documentation Overview

### Getting Started
- **[Main README](../README.md)** - Project overview and quick start
- **[Cloud-Init README](../README-cloud-init.md)** - Detailed cloud-init features
- **[Studio README](../README-STUDIO.md)** - Modern UI features and usage

### Project Information
- **[Project Summary](../PROJECT-SUMMARY.md)** - What we've built and why
- **[Changelog](../CHANGELOG.md)** - Version history and changes
- **[Release Notes](../RELEASE-NOTES.md)** - Latest release information
- **[Roadmap](../ROADMAP.md)** - Future plans and features

### Contributing
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](../SECURITY.md)** - Security guidelines and reporting
- **[Code of Conduct](../CODE_OF_CONDUCT.md)** - Community guidelines

### Technical Documentation
- **[API Documentation](../API.md)** - HTTP and WebSocket API reference
- **[Examples](../examples/)** - Example configurations and use cases

### GitHub Integration
- **[Issue Templates](../.github/ISSUE_TEMPLATE/)** - Bug reports and feature requests
- **[Pull Request Template](../.github/pull_request_template.md)** - PR guidelines
- **[Workflows](../.github/workflows/)** - CI/CD pipelines

## 🚀 Quick Links

### For Users
1. [Quick Start Guide](../README-cloud-init.md#quick-start)
2. [Example Configurations](../examples/cloud-init/)
3. [Security Best Practices](../SECURITY.md#security-considerations-for-deployment)
4. [API Usage Examples](../API.md#examples)

### For Developers
1. [Development Setup](../CONTRIBUTING.md#development-setup)
2. [Architecture Overview](#architecture)
3. [API Reference](../API.md)
4. [Testing Guide](../CONTRIBUTING.md#testing-your-changes)

### For Operations
1. [Deployment Guide](../README-cloud-init.md#using-docker-compose-recommended)
2. [Security Hardening](../SECURITY.md#example-secure-deployment)
3. [Monitoring Setup](../API.md#monitoring)
4. [Troubleshooting](../README-cloud-init.md#troubleshooting)

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                   netboot.xyz Studio                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Web UI      │  │ WebSocket    │  │ HTTP API      │  │
│  │ Port: 3000  │  │ Port: 3000   │  │ Port: 80      │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│         │                │                   │           │
│  ┌──────┴────────────────┴───────────────────┴────────┐ │
│  │              Node.js Application                    │ │
│  │  - Express Server                                   │ │
│  │  - Socket.IO                                        │ │
│  │  - Cloud-Init Handler                               │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────┴─────────────────────────┐   │
│  │              File System                         │   │
│  │  /config     - netboot.xyz configurations       │   │
│  │  /assets     - Boot images and ISOs             │   │
│  │  /cloud-init - Cloud-init configs               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ TFTP Server     │  │ NGINX                       │  │
│  │ Port: 69/UDP    │  │ Port: 80                    │  │
│  └─────────────────┘  └─────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **PXE Boot Flow**:
   ```
   Client → DHCP → TFTP (port 69) → iPXE Menu → HTTP (port 80) → Boot
   ```

2. **Cloud-Init Flow**:
   ```
   Boot → Cloud-Init → HTTP API → YAML Config → System Configuration
   ```

3. **Management Flow**:
   ```
   User → Web UI → WebSocket → Backend → File System → Response
   ```

## 📖 Usage Scenarios

### Scenario 1: Automated Server Deployment
1. Create cloud-init configuration in the web UI
2. Boot server via PXE
3. Select OS with cloud-init support
4. Server automatically configures itself

### Scenario 2: Development Environment Setup
1. Use the [dev-environment.yaml](../examples/cloud-init/dev-environment.yaml) template
2. Customize for your needs
3. Deploy to physical or virtual machines

### Scenario 3: Kubernetes Node Provisioning
1. Create node configuration with kubeadm
2. Boot nodes sequentially
3. Automatically join cluster

## 🔧 Advanced Topics

### Custom Templates
Create your own templates in `/cloud-init/templates/`:
```yaml
#cloud-config
# template: my-custom-template
# description: My custom server configuration
```

### iPXE Scripting
Customize boot menus in `/config/menus/custom.ipxe`:
```ipxe
#!ipxe
menu Custom Boot Menu
item ubuntu Ubuntu 22.04 with Cloud-Init
choose option && goto ${option}
```

### Automation Integration
Use the API for automation:
```bash
# Deploy multiple servers
for i in {1..10}; do
  curl -X POST http://netboot-server/api/deploy \
    -d "config=web-server&hostname=web-${i}"
done
```

## 📞 Support

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Wiki**: Community-contributed guides

### Commercial Support
For enterprise support options, please contact the maintainers.

## 📄 License

This project is licensed under the same terms as netboot.xyz. See [LICENSE](../LICENSE) for details.

---

*This documentation is continuously updated. For the latest version, visit the [GitHub repository](https://github.com/yourusername/cloud-init-pxe).*