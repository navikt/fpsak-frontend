FROM openresty/openresty:alpine-fat
LABEL maintainer="teamforeldrepenger"

RUN apk add --no-cache --update bash gettext libintl openssl \
    && luarocks install lua-resty-session \
    && luarocks install lua-resty-http \
    && luarocks install lua-resty-jwt \
    && luarocks install lua-resty-openidc

COPY docker/default-config.nginx /etc/nginx/conf.d/app.conf.template
COPY docker/oidc_access.lua      /usr/local/openresty/nginx/
COPY docker/start-nginx.sh       /usr/sbin/start-nginx
RUN chmod u+x /usr/sbin/start-nginx

#FPSAK spesifikk
ENV APP_DIR="/app" \
	APP_PATH_PREFIX="/fpsak/" \
	APP_CALLBACK_PATH="/fpsak/cb" \
	APP_URL_FPTILBAKE="http://fptilbake" \
	APP_URL_FPOPPDRAG="http://fpoppdrag" \
	APP_URL_FPSAK="http://fpsak"

#FPSAK spesifkk
COPY dist ./app/fpsak/

#FPSAK spesifkk
COPY docker/locations.nginx      /nginx/locations.nginx

EXPOSE 9000 443

WORKDIR ${APP_DIR}

CMD ["start-nginx"]
