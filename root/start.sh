#!/bin/bash

# make our folders
mkdir -p \
  /assets \
  /config/nginx/site-confs \
  /config/log/nginx \
  /run \
  /var/lib/nginx/tmp/client_body \
  /var/tmp/nginx

# copy config files
[[ ! -f /config/nginx/nginx.conf ]] && \
  cp /defaults/nginx.conf /config/nginx/nginx.conf
[[ ! -f /config/nginx/site-confs/default ]] && \
  cp /defaults/default /config/nginx/site-confs/default
  
# Ownership
chown -R cipxe:cipxe /assets
chown -R cipxe:cipxe /var/lib/nginx
chown -R cipxe:cipxe /var/log/nginx

# create local logs dir
mkdir -p \
  /config/menus/remote \
  /config/menus/local

# download menus if not found
if [[ ! -f /config/menus/remote/menu.ipxe ]]; then
  if [[ -z ${MENU_VERSION+x} ]]; then \
    MENU_VERSION=$(curl -sL "https://api.github.com/repos/cloud-init-pxe/cloud-init-pxe/releases/latest" | jq -r '.tag_name')
  fi
  echo "[cloud-init-pxe-init] Downloading cloud-init-pxe at ${MENU_VERSION}"
  # menu files
  curl -o \
    /config/endpoints.yml -sL \
    "https://raw.githubusercontent.com/cloud-init-pxe/cloud-init-pxe/${MENU_VERSION}/endpoints.yml"
  curl -o \
    /tmp/menus.tar.gz -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/menus.tar.gz"
  tar xf \
    /tmp/menus.tar.gz -C \
    /config/menus/remote
  # boot files
  curl -o \
    /config/menus/remote/cloud-init-pxe.kpxe -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe.kpxe"
  curl -o \
    /config/menus/remote/cloud-init-pxe-undionly.kpxe -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe-undionly.kpxe"
  curl -o \
    /config/menus/remote/cloud-init-pxe.efi -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe.efi"
  curl -o \
    /config/menus/remote/cloud-init-pxe-snp.efi -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe-snp.efi"
  curl -o \
    /config/menus/remote/cloud-init-pxe-snponly.efi -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe-snponly.efi"
  curl -o \
    /config/menus/remote/cloud-init-pxe-arm64.efi -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe-arm64.efi"
  curl -o \
    /config/menus/remote/cloud-init-pxe-arm64-snp.efi -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe-arm64-snp.efi"
  curl -o \
    /config/menus/remote/cloud-init-pxe-arm64-snponly.efi -sL \
    "https://github.com/cloud-init-pxe/cloud-init-pxe/releases/download/${MENU_VERSION}/cloud-init-pxe-arm64-snponly.efi"
  # layer and cleanup
  echo -n ${MENU_VERSION} > /config/menuversion.txt
  cp -r /config/menus/remote/* /config/menus
  rm -f /tmp/menus.tar.gz
fi

# Ownership
chown -R cipxe:cipxe /config

echo "   ____ _                 _       _____       _ _     ____  __  _______ "
echo "  / ___| | ___  _   _  __| |     |_   _|_ __ (_) |_  |  _ \\\\ \\/ / ____|"
echo " | |   | |/ _ \\| | | |/ _\` |_____  | |_| '_ \\| | __| | |_) \\  /|  _|  "
echo " | |___| | (_) | |_| | (_| |_____| | |_| | | | | |_  |  __//  \\| |___ "
echo "  \\____|_|\\___/ \\__,_|\\__,_|       |_(_)_| |_|_|\\__| |_|  /_/\\_\\_____|"
echo "                                                                       "

supervisord -c /etc/supervisor.conf
