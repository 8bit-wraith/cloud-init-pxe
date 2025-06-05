ARG CIP_OVERRIDES=default

FROM ghcr.io/cloudinitpxecom/builder:latest AS builder

# repo for build
COPY . /ansible

FROM builder AS cloudinitpxecom-default
ENV EXTRA_VARS=""

FROM builder AS cloudinitpxecom-production
ENV EXTRA_VARS="--extra-vars @script/cloudinitpxecom-overrides.yml"

FROM cloudinitpxecom-${CIP_OVERRIDES} AS final
RUN \
  echo "**** running ansible ****" && \
  cd /ansible && \
  ansible-playbook site.yml ${EXTRA_VARS}

# runtime stage
FROM alpine:latest

COPY --from=final /var/www/html/ /mnt/
COPY docker-build-root/ /

ENTRYPOINT [ "/dumper.sh" ]
