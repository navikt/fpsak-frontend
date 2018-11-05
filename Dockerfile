FROM openresty/openresty:alpine-fat
LABEL maintainer="teamforeldrepenger"

COPY ./dist /app

RUN apk add --no-cache bash gettext libintl

RUN ["luarocks", "install", "lua-resty-session"]
RUN ["luarocks", "install", "lua-resty-http"]
RUN ["luarocks", "install", "lua-resty-jwt"]
RUN ["luarocks", "install", "lua-resty-openidc"]

COPY docker/openidc.lua /usr/local/openresty/lualib/resty/

ENV DEBUG=on \
	APP_DIR=/app \
	APP_PATH_PREFIX=/aSubSiteInParentDomainUseThisPath \
	APP_API_PLACEHOLDER="/fpsak" \
	APP_API_GATEWAY="" \
	CLIENT_BODY_TIMEOUT=10 \
	CLIENT_HEADER_TIMEOUT=10 \
	CLIENT_MAX_BODY_SIZE=1024 \
	WHITE_LIST_IP=(172.17.0.1)|(192.168.0.25) \
	WHITE_LIST=off

COPY docker/default-config.nginx /etc/nginx/conf.d/app.conf.template
COPY docker/start-nginx.sh /usr/sbin/start

RUN chmod u+x /usr/sbin/start

EXPOSE 8080

WORKDIR ${APP_DIR}

CMD ["start"]
