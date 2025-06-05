# Cloud-Init PXE Studio - Modern PXE Boot & Cloud-Init Management

A complete reimagining of the original Cloud-Init-PXE with a stunning modern interface that unifies PXE boot management and cloud-init configuration in one beautiful application. Say goodbye to dated interfaces and hello to a professional, intuitive experience.

## ✨ Key Features

### 🎨 Beautiful Modern Interface

- **Unified Dashboard** - All your PXE boot and cloud-init tools in one stunning interface
- **Dark/Light Theme** - Professional dark theme by default, with a clean light mode
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Smart Navigation** - Collapsible sidebar that adapts to your workflow

### 🚀 Core Functionality

- **PXE Boot Management** - Full Cloud-Init PXE functionality with a modern twist
- **Cloud-Init Studio** - Create, edit, and manage cloud-init configurations
- **Boot Menu Editor** - Customize iPXE scripts with syntax highlighting
- **Asset Management** - Download and organize boot images and ISOs
- **Template Library** - Pre-built configurations for common scenarios
- **Real-time Monitoring** - System stats, version tracking, and health checks

### 💡 Developer Experience

- **CodeMirror Integration** - Professional code editing for YAML and iPXE
- **WebSocket Updates** - Real-time synchronization across all features
- **Toast Notifications** - Non-intrusive feedback for every action
- **One-Click Actions** - Common tasks are always one click away
- **HTTP API** - Serve cloud-init configs via standard endpoints

## Quick Start

### Using Docker Compose (Recommended)

1. Clone this repository:

```bash
git clone <your-repo>
cd cloud-init-pxe
```

2. Build and run the container:

```bash
docker-compose -f docker-compose-cloud-init.yml up -d
```

3. Access the web interfaces:
   - Main Cloud-Init PXE interface: <http://localhost:3000>
   - Cloud-Init manager: <http://localhost:3000/cloud-init>

### Using Docker CLI

```bash
# Build the image
docker build -f Dockerfile.cloud-init -t cloudinitpxe:latest .

# Run the container
docker run -d \
  --name cloudinitpxe \
  -p 3000:3000 \
  -p 69:69/udp \
  -p 8080:80 \
  -v $(pwd)/config:/config \
  -v $(pwd)/assets:/assets \
  -v $(pwd)/cloud-init-data:/cloud-init \
  --cap-add NET_ADMIN \
  cloudinitpxe:latest
```

## Cloud-Init Configuration

### Web Interface

1. Navigate to <http://localhost:3000/cloud-init>
2. Create new configurations or edit existing ones
3. Use templates for common setups:
   - `basic-setup.yaml` - Basic server configuration
   - `kubernetes-node.yaml` - Kubernetes node setup

### Configuration URLs

Once you create a configuration, it will be available at:

- User-data: `http://<server-ip>:8080/cloud-init/user-data/<config-name>.yaml`
- Meta-data: `http://<server-ip>:8080/cloud-init/meta-data`

### Using with iPXE

The container includes a custom iPXE menu for Ubuntu with cloud-init support. To use it:

1. Create or select a cloud-init configuration in the web interface
2. Boot via PXE and navigate to the custom menu
3. Select "Ubuntu with Cloud-Init Support"
4. Choose your configuration or enter a custom one

Example iPXE script integration:

```ipxe
#!ipxe
# Boot Ubuntu with cloud-init
set cloud_init_config my-config.yaml
kernel http://archive.ubuntu.com/ubuntu/dists/jammy/main/installer-amd64/current/legacy-images/netboot/ubuntu-installer/amd64/linux
initrd http://archive.ubuntu.com/ubuntu/dists/jammy/main/installer-amd64/current/legacy-images/netboot/ubuntu-installer/amd64/initrd.gz
imgargs linux auto=true priority=critical cloud-config-url=http://${next-server}:8080/cloud-init/user-data/${cloud_init_config} ds=nocloud-net;s=http://${next-server}:8080/cloud-init/
boot
```

## Directory Structure

```bash
/config              # Cloud-Init PXE configurations
  /menus             # iPXE menus
  /nginx             # Nginx configuration
/assets              # Downloaded boot assets
/cloud-init          # Cloud-init configurations
  /configs           # User-created configurations
  /templates         # Pre-built templates
```

## Creating Custom Templates

Add new templates to the `cloud-init/templates/` directory before building the container:

```yaml
#cloud-config
# Your custom template
package_update: true
packages:
  - your-packages
```

## Environment Variables

- `MENU_VERSION` - Cloud-Init PXE menu version (default: latest)
- `NGINX_PORT` - Nginx port (default: 80)
- `WEB_APP_PORT` - Web app port (default: 3000)
- `TFTPD_OPTS` - Additional TFTP server options

## Network Requirements

- Port 69/UDP - TFTP for PXE booting
- Port 3000/TCP - Web management interface
- Port 80/TCP - HTTP for serving boot files and cloud-init configs

## DHCP Configuration

Configure your DHCP server to point to this server:

```java
# ISC DHCP example
next-server <server-ip>;
filename "cloud-init-pxe.kpxe";

# For UEFI systems
if option arch = 00:07 {
  filename "cloud-init-pxe.efi";
}
```

## Security Considerations

- The cloud-init configurations are served without authentication
- Ensure your network is properly secured
- Consider using a reverse proxy with authentication for the web interface
- Validate all cloud-init configurations before deployment

## Troubleshooting

1. **Container won't start**: Check if ports are already in use
2. **TFTP not working**: Ensure the container has NET_ADMIN capability
3. **Cloud-init not loading**: Verify the URLs are accessible from the target system
4. **Configuration errors**: Check the web interface for YAML validation errors

## Contributing

Feel free to submit issues and pull requests for improvements.

## License

This project follows the same license as the original Cloud-Init-PXE project.
