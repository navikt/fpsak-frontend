FROM node:10-alpine as builder
WORKDIR /home/app
COPY ./ ./

RUN yarn install --ignore-scripts
RUN yarn build

FROM openresty/openresty:alpine-fat
LABEL maintainer="teamforeldrepenger"

RUN apk add --no-cache bash gettext libintl

RUN ["luarocks", "install", "lua-resty-session"]
RUN ["luarocks", "install", "lua-resty-http"]
RUN ["luarocks", "install", "lua-resty-jwt"]
RUN ["luarocks", "install", "lua-resty-openidc"]

COPY docker/openidc.lua /usr/local/openresty/lualib/resty/
COPY docker/default-config.nginx /etc/nginx/conf.d/app.conf.template
COPY docker/oidc_access.lua /usr/local/openresty/nginx/
COPY docker/start-nginx.sh /usr/sbin/start-nginx
RUN chmod u+x /usr/sbin/start-nginx

#FPSAK spesifikk
ENV APP_DIR="/app" \
	APP_PATH_PREFIX="/fpsak/" \
	APP_CALLBACK_PATH="/fpsak/cb" \
	APP_URL_FPTILBAKE="http://fptilbake" \
	APP_URL_FPOPPDRAG="http://fpoppdrag" \
	APP_URL_FPSAK="http://fpsak"

COPY --from=builder ./home/app/dist ./app/fpsak/
COPY docker/locations.nginx      /nginx/locations.nginx

EXPOSE 9000 443

WORKDIR ${APP_DIR}

CMD ["start-nginx"]
