# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Cloud-Init PXE Studio seriously. If you have discovered a security vulnerability, please follow these steps:

### 1. Do NOT Create a Public Issue

Security vulnerabilities should **not** be reported through public GitHub issues.

### 2. Email Security Report

Please email your findings to: `security@[project-domain]` (update this with actual email)

Include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Within 60 days

## Security Considerations for Deployment

### Network Security

1. **Internal Networks Only**: This application is designed for trusted internal networks
2. **No Built-in Authentication**: Add authentication via reverse proxy if needed
3. **Firewall Rules**: Restrict access to necessary ports only:
   - Port 3000: Web interface (consider reverse proxy)
   - Port 69/UDP: TFTP (required for PXE)
   - Port 80: HTTP assets (required for boot)

### Configuration Security

1. **Cloud-Init Secrets**: Never store passwords or keys in cloud-init configs
2. **Use Variables**: Use cloud-init variables for sensitive data
3. **Encrypt Sensitive Data**: Use cloud-init's encryption features
4. **Regular Audits**: Review configurations regularly

### Container Security

1. **Run as Non-Root**: The container runs services as non-root where possible
2. **Minimal Base Image**: Alpine Linux for smaller attack surface
3. **Regular Updates**: Keep the container image updated
4. **Resource Limits**: Set appropriate Docker resource limits

### Example Secure Deployment

```yaml
version: '3.8'
services:
  cloudinitpxe:
    image: ghcr.io/yourusername/cloud-init-pxe-studio:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"  # Bind to localhost only
      - "69:69/udp"            # Required for TFTP
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      - ./config:/config:ro    # Read-only where possible
      - ./assets:/assets
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_ADMIN              # Required for TFTP
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
```

### Reverse Proxy with Authentication

```nginx
server {
    listen 443 ssl http2;
    server_name cloud-init-pxe.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Basic authentication
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Security Features Roadmap

We're planning to add the following security features:

- [ ] Built-in authentication options
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Configuration encryption at rest
- [ ] API rate limiting
- [ ] HTTPS support for asset serving
- [ ] Signed configurations

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who follow this policy.

## Learn More

- [OWASP Security Guidelines](https://owasp.org/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Cloud-Init Security](https://cloudinit.readthedocs.io/en/latest/topics/security.html)