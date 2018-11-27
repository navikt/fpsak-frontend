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
COPY docker/adrum_cookie_saver.lua /usr/local/openresty/nginx/
COPY docker/start-nginx.sh /usr/sbin/start
RUN chmod u+x /usr/sbin/start

## FPSAK spesifikk
ENV DEBUG=on \
	APP_DIR="/app" \
	APP_PATH_PREFIX="/fpsak/" \
	APP_LOGIN_PATH="/fpsak/jetty/login" \
	APP_CALLBACK_PATH="/fpsak/cb" \
	APP_API_PATH="/fpsak/api/" \
	APP_API_GATEWAY="http://fpsak"

COPY --from=builder ./home/app/dist ./app/fpsak/

# kopierer statiske filer
COPY ./public/sprak ./app/fpsak/sprak
COPY ./public/appdynamics ./app/fpsak/appdynamics

EXPOSE 9000 443

WORKDIR ${APP_DIR}

CMD ["start"]
