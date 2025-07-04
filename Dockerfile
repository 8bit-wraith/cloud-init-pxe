FROM alpine:3.21.3

# set version label
ARG BUILD_DATE
ARG VERSION
ARG WEBAPP_VERSION

LABEL build_version="Cloud-Init-PXE version: ${VERSION} Build-date: ${BUILD_DATE}"
LABEL maintainer="antonym"
LABEL org.opencontainers.image.description="Cloud-Init-PXE official docker container - Your favorite operating systems in one place. A network-based bootable operating system installer based on iPXE."

RUN \
 apk update && \
 apk upgrade && \
 apk add --no-cache \
   bash \
   busybox \
   curl \
   envsubst \
   git \
   jq \
   nghttp2-dev \
   nginx \
   nodejs \
   shadow \
   sudo \
   supervisor \
   syslog-ng \
   tar \
   dnsmasq && \
 apk add --no-cache --virtual=build-dependencies \
   npm && \
 groupmod -g 1000 users && \
 useradd -u 911 -U -d /config -s /bin/false cip && \
 usermod -G users cip && \
 mkdir /app \
       /config \
       /defaults 

COPY . /app

RUN \
 npm install --prefix /app && \
 apk del --purge build-dependencies && \
 rm -rf /tmp/*

ENV TFTPD_OPTS=''
ENV NGINX_PORT='80'
ENV WEB_APP_PORT='3000'

EXPOSE 69/udp
EXPOSE 80
EXPOSE 3000

COPY docker-cloudinitpxecom/root/ /

# default command
CMD ["sh","/start.sh"]

