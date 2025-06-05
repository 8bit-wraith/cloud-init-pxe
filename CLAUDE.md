# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

### Node.js Application
- Install dependencies: `npm install`
- Run application: `npm start` or `node app.js`
- Run tests: **NOT IMPLEMENTED** (package.json shows no test framework)
- Lint: **NOT CONFIGURED** (no ESLint setup)
- Format: **NOT CONFIGURED** (no Prettier setup)

### Docker Commands
- Build image: `./build-cloud-init.sh` or `docker build . -t cloud-init-pxe`
- Build with compose: `docker-compose -f docker-compose-cloud-init.yml up --build`
- Run container: `docker-compose -f docker-compose-cloud-init.yml up -d`
- Stop container: `docker-compose -f docker-compose-cloud-init.yml down`
- View logs: `docker-compose -f docker-compose-cloud-init.yml logs -f`
- Shell access: `docker exec -it cloud-init-pxe /bin/bash`

### Management Script
The colorful `scripts/manage.sh` provides these commands:
- `./scripts/manage.sh build` - Build Docker image
- `./scripts/manage.sh start` - Start container
- `./scripts/manage.sh stop` - Stop container
- `./scripts/manage.sh restart` - Restart container
- `./scripts/manage.sh status` - Check container status
- `./scripts/manage.sh logs` - View container logs
- `./scripts/manage.sh help` - Show help with ASCII art

## High-Level Architecture

### Application Structure
Cloud-Init-PXE is a Node.js/Express application that provides:
1. **Web Interface** (Port 3000) - Modern UI for managing iPXE configurations
2. **TFTP Server** (Port 69/udp) - Serves boot files to network clients
3. **NGINX Server** (Port 8080) - Hosts boot assets (kernels, initrds, ISOs)
4. **WebSocket Support** - Real-time updates via Socket.IO

### Key Technologies
- **Express.js**: Web framework for the main application
- **Socket.IO**: Real-time bidirectional communication
- **EJS**: Template engine for dynamic HTML rendering
- **Node-Downloader-Helper**: Downloads boot assets from remote sources
- **js-yaml**: Parses and generates cloud-init configurations
- **Systeminformation**: Provides system stats for the UI

### Directory Structure
- `/app.js` - Main Express application entry point
- `/public/` - Frontend assets and EJS templates
- `/cloud-init/` - Cloud-init specific handlers and templates
- `/config/` - Configuration files and iPXE menus
- `/assets/` - Downloaded boot assets (kernels, images)
- `/root/` - Docker container startup scripts

### Cloud-Init Integration
The application extends netboot.xyz with cloud-init capabilities:
- Custom cloud-init handler (`cloud-init/cloud-init-handler.js`)
- Pre-built templates in `cloud-init/templates/`
- Web UI for editing cloud-init configurations
- Integration with iPXE boot process

### Port Configuration
Default ports (customizable via environment variables):
- 3000: Web application
- 69/udp: TFTP server
- 8080: NGINX asset server

### Docker Architecture
- Based on Alpine Linux for minimal footprint
- Multi-service container managed by Supervisor
- NGINX for static asset serving
- dnsmasq for TFTP functionality

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run locally (requires Node.js)
npm start

# Access at http://localhost:3000
```

### Docker Development
```bash
# Build and run with docker-compose
docker-compose -f docker-compose-cloud-init.yml up --build

# Or use the management script
./scripts/manage.sh build
./scripts/manage.sh start
```

### Making Changes
1. Edit source files (app.js, public/, cloud-init/)
2. If running locally: Restart with `npm start`
3. If using Docker: Rebuild with `./scripts/manage.sh restart`
4. Test changes via web UI at http://localhost:3000

### Adding New Cloud-Init Templates
1. Create YAML template in `cloud-init/templates/`
2. Template will auto-appear in web UI
3. Follow cloud-init schema for compatibility

## Code Style Guidelines

### JavaScript
- Use ES6+ features where appropriate
- Async/await preferred over callbacks
- Comment complex logic extensively (Trish insists!)
- Keep functions focused and under 50 lines

### File Organization
- Group related functionality in modules
- Keep routes in app.js organized by feature
- Templates in public/ should be minimal logic

## Testing Considerations

**IMPORTANT**: No test framework is currently implemented. When adding tests:
- Consider Jest or Mocha for unit tests
- Add `npm test` script to package.json
- Test critical paths: boot file generation, cloud-init parsing
- Mock external dependencies (downloads, file system)

## Known Limitations

1. No automated tests
2. No linting/formatting configuration
3. Single container runs multiple services (anti-pattern for production)
4. Limited error handling in some async operations
5. WebSocket connections may timeout on long operations

## Integration Points

### netboot.xyz Compatibility
- Preserves original netboot.xyz menu structure
- Compatible with standard iPXE clients
- Extends rather than replaces functionality

### Cloud Provider Support
- Generic cloud-init configurations work across providers
- Templates can be customized per provider
- Supports both NoCloud and standard cloud-init datasources