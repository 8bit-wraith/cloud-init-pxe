# netboot.xyz Studio API Documentation

This document describes the HTTP API endpoints available in netboot.xyz Studio.

## Base URLs

- Web Interface: `http://<server>:3000`
- Asset Server: `http://<server>:80` (or configured NGINX_PORT)
- WebSocket: `ws://<server>:3000/socket.io/`

## Authentication

Currently, the API does not require authentication. This is designed for trusted internal networks only. See [SECURITY.md](SECURITY.md) for securing your deployment.

## Cloud-Init API Endpoints

### Get User Data Configuration

Retrieve a cloud-init user-data configuration file.

**Endpoint:** `GET /cloud-init/user-data/<config-name>.yaml`

**Example Request:**
```bash
curl http://localhost:80/cloud-init/user-data/basic-setup.yaml
```

**Example Response:**
```yaml
#cloud-config
package_update: true
packages:
  - htop
  - git
users:
  - name: admin
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3...
```

**Response Codes:**
- `200 OK` - Configuration found and returned
- `404 Not Found` - Configuration does not exist

### Get Meta Data

Retrieve the cloud-init meta-data.

**Endpoint:** `GET /cloud-init/meta-data`

**Example Request:**
```bash
curl http://localhost:80/cloud-init/meta-data
```

**Example Response:**
```yaml
instance-id: iid-local01
local-hostname: cloudimg
```

**Response Codes:**
- `200 OK` - Meta-data returned

## WebSocket API

The application uses Socket.IO for real-time communication. Connect to `ws://<server>:3000/socket.io/`.

### Events

#### Client to Server

**`cloud-init:list`**
Request list of cloud-init configurations.
```javascript
socket.emit('cloud-init:list');
```

**`cloud-init:get`**
Get a specific configuration.
```javascript
socket.emit('cloud-init:get', { name: 'basic-setup' });
```

**`cloud-init:save`**
Save a configuration.
```javascript
socket.emit('cloud-init:save', {
  name: 'my-config',
  content: '#cloud-config\n...',
  documentation: '# My Config\nThis configuration...'
});
```

**`cloud-init:delete`**
Delete a configuration.
```javascript
socket.emit('cloud-init:delete', { name: 'my-config' });
```

**`cloud-init:validate`**
Validate YAML syntax.
```javascript
socket.emit('cloud-init:validate', { content: '#cloud-config\n...' });
```

#### Server to Client

**`cloud-init:list:response`**
Returns list of configurations.
```javascript
socket.on('cloud-init:list:response', (data) => {
  // data.configs = ['basic-setup', 'kubernetes-node', ...]
  // data.templates = ['basic-setup', 'docker-host', ...]
});
```

**`cloud-init:get:response`**
Returns configuration content.
```javascript
socket.on('cloud-init:get:response', (data) => {
  // data.content = '#cloud-config\n...'
  // data.documentation = '# Configuration Title\n...'
  // data.isTemplate = false
});
```

**`cloud-init:save:response`**
Confirmation of save.
```javascript
socket.on('cloud-init:save:response', (data) => {
  // data.success = true
  // data.message = 'Configuration saved successfully'
});
```

**`cloud-init:error`**
Error notifications.
```javascript
socket.on('cloud-init:error', (data) => {
  // data.message = 'Error description'
  // data.error = 'Detailed error'
});
```

## Boot Menu API

### Get Boot Menu List

**WebSocket Event:** `menu:list`
```javascript
socket.emit('menu:list');
```

**Response Event:** `menu:list:response`
```javascript
{
  menus: ['custom.ipxe', 'linux.ipxe', 'windows.ipxe']
}
```

### Get Menu Content

**WebSocket Event:** `menu:get`
```javascript
socket.emit('menu:get', { name: 'custom.ipxe' });
```

### Save Menu

**WebSocket Event:** `menu:save`
```javascript
socket.emit('menu:save', {
  name: 'custom.ipxe',
  content: '#!ipxe\n...'
});
```

## Asset Management API

### List Assets

**WebSocket Event:** `asset:list`
```javascript
socket.emit('asset:list');
```

### Download Asset

**HTTP Endpoint:** `GET /assets/<path>`

**Example:**
```bash
curl -O http://localhost:80/assets/ubuntu/jammy-live-server-amd64.iso
```

## System Information API

### Get System Stats

**WebSocket Event:** `system:stats`
```javascript
socket.emit('system:stats');
```

**Response Event:** `system:stats:response`
```javascript
{
  cpu: {
    usage: 15.5,
    cores: 4
  },
  memory: {
    total: 8192,
    used: 3072,
    percentage: 37.5
  },
  uptime: 86400,
  version: 'v2.0.0'
}
```

## TFTP Information

The TFTP server runs on port 69/UDP and serves files from `/config/menus/`.

### Available Files
- `netboot.xyz.kpxe` - Legacy BIOS
- `netboot.xyz.efi` - UEFI systems
- `custom.ipxe` - Custom boot menu

### DHCP Configuration Example
```
next-server <server-ip>;
filename "netboot.xyz.kpxe";
```

## Examples

### Using with curl

**Get a cloud-init configuration:**
```bash
# Get user-data
curl http://192.168.1.100:80/cloud-init/user-data/web-server.yaml

# Get meta-data
curl http://192.168.1.100:80/cloud-init/meta-data
```

### Using with cloud-init

**In your boot parameters:**
```
ds=nocloud-net;s=http://192.168.1.100:80/cloud-init/
```

**Or with a specific config:**
```
cloud-config-url=http://192.168.1.100:80/cloud-init/user-data/web-server.yaml
```

### WebSocket Client Example

```javascript
// Connect to WebSocket
const socket = io('http://192.168.1.100:3000');

// Get list of configurations
socket.emit('cloud-init:list');
socket.on('cloud-init:list:response', (data) => {
  console.log('Available configs:', data.configs);
});

// Save a new configuration
socket.emit('cloud-init:save', {
  name: 'my-server',
  content: `#cloud-config
hostname: my-server
packages:
  - nginx
  - postgresql`,
  documentation: '# My Server\nThis configures a web server with database.'
});

// Listen for errors
socket.on('cloud-init:error', (error) => {
  console.error('Error:', error.message);
});
```

### Python Example

```python
import requests
import socketio

# HTTP API
response = requests.get('http://192.168.1.100:80/cloud-init/user-data/basic-setup.yaml')
config = response.text

# WebSocket API
sio = socketio.Client()
sio.connect('http://192.168.1.100:3000')

@sio.on('cloud-init:list:response')
def on_list(data):
    print('Configurations:', data['configs'])

sio.emit('cloud-init:list')
sio.wait()
```

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing a reverse proxy with rate limiting.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

WebSocket errors are emitted via the `cloud-init:error` event.

## Monitoring

Monitor the application health by checking:
- HTTP endpoint availability: `curl -I http://<server>:3000`
- TFTP service: `tftp <server> -c get netboot.xyz.kpxe /tmp/test.kpxe`
- WebSocket connectivity: Connect and emit `system:stats`

## Future API Enhancements

Planned for future releases:
- RESTful HTTP API for all operations
- API versioning (`/api/v1/`)
- Authentication tokens
- Rate limiting
- OpenAPI/Swagger documentation
- GraphQL endpoint
- Webhooks for events