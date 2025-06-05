# cloud-init-pxe webapp

This repo houses the cloud-init-pxe webapp that
provides a web interface for editing iPXE files
and downloading assets locally to the app.

The app is versioned over time and is integrated into the docker-cloudinitpxe
project located [here](https://github.com/cloudinitpxe/docker-cloudinitpxe).

## Building cloud-init-pxe webapp locally

Uses the docker-cloudinitpxe repo for source files to avoid duplication of configs:

```bash
git clone https://github.com/cloudinitpxe/webapp
cd webapp
git clone https://github.com/cloudinitpxe/docker-cloudinitpxe
docker build . -t cloudinitpxe-webapp
```

## Running it locally

```bash
docker run -d \
  --name=cloudinitpxe-webapp \
  -e MENU_VERSION=2.0.84             `# optional` \
  -p 3000:3000                       `# sets webapp port` \
  -p 69:69/udp                       `# sets tftp port` \
  -p 8080:80                         `# optional` \
  -v /local/path/to/config:/config   `# optional` \
  -v /local/path/to/assets:/assets   `# optional` \
  --restart unless-stopped \
  cloudinitpxe-webapp
```

* Port 3000: Web Application
* Port 8080: NGINX Webserver for local asset hosting
* Port 69: TFTP server for menus/kpxe files

## Running the latest webapp-dev build

To run the build that contains the latest commited changes:

```bash
docker run -d \
  --name=cloudinitpxe-webapp-dev \
  -e MENU_VERSION=2.0.84             `# optional` \
  -p 3000:3000                       `# sets webapp port` \
  -p 69:69/udp                       `# sets tftp port` \
  -p 8080:80                         `# optional` \
  -v /local/path/to/config:/config   `# optional` \
  -v /local/path/to/assets:/assets   `# optional` \
  --restart unless-stopped \
  ghcr.io/cloudinitpxe/webapp-dev:latest
```
