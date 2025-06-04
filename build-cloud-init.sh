#!/bin/bash

# Build script for netboot.xyz with cloud-init support

set -e

echo "Building netboot.xyz with cloud-init support..."

# Set build arguments
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION=${VERSION:-latest}

# Create necessary directories
mkdir -p config assets cloud-init-data

# Stop and remove existing container if running
docker stop netbootxyz-cloud-init 2>/dev/null || true
docker rm netbootxyz-cloud-init 2>/dev/null || true

# Build the Docker image with no cache to ensure fresh build
docker build \
  --no-cache \
  --build-arg BUILD_DATE="$BUILD_DATE" \
  --build-arg VERSION="$VERSION" \
  -f Dockerfile.cloud-init \
  -t netbootxyz-cloud-init:latest \
  .

echo "Build complete!"
echo ""
echo "To run the container using docker-compose:"
echo "  docker-compose -f docker-compose-cloud-init.yml up -d"
echo ""
echo "To run the container using docker:"
echo "  docker run -d \\"
echo "    --name netbootxyz-cloud-init \\"
echo "    -p 3000:3000 \\"
echo "    -p 69:69/udp \\"
echo "    -p 8080:80 \\"
echo "    -v \$(pwd)/config:/config \\"
echo "    -v \$(pwd)/assets:/assets \\"
echo "    -v \$(pwd)/cloud-init-data:/cloud-init \\"
echo "    --cap-add NET_ADMIN \\"
echo "    netbootxyz-cloud-init:latest"
echo ""
echo "Access the web interface at:"
echo "  - Main interface: http://localhost:3000"
echo "  - Cloud-Init manager: http://localhost:3000/cloud-init" 