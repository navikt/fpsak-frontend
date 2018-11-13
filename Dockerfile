FROM node:10-alpine as builder
COPY ./package.* ./
COPY ./ ./
ARG YARN_PROXY
ARG YARN_HTTPS_PROXY
RUN env
RUN yarn config set registry https://registry.npmjs.org/
RUN yarn config list
#RUN npm config list
RUN yarn install

#RUN yarn config set registry https://registry.npmjs.org/
#RUN npm install
#RUN npm run build

FROM openresty/openresty:alpine-fat
LABEL maintainer="teamforeldrepenger"

COPY --from=builder ./dist /app

RUN apk add --no-cache bash gettext libintl

RUN ["luarocks", "install", "lua-resty-session"]
RUN ["luarocks", "install", "lua-resty-http"]
RUN ["luarocks", "install", "lua-resty-jwt"]
RUN ["luarocks", "install", "lua-resty-openidc"]

COPY docker/openidc.lua /usr/local/openresty/lualib/resty/

ENV DEBUG=on \
	APP_DIR=/app \
	APP_PATH_PREFIX="/" \
	APP_LOGIN_PATH="/fpsak/jetty/login" \
	APP_CALLBACK_PATH="/fpsak/cb" \
	APP_API_GATEWAY="http://fpsak"

COPY docker/default-config.nginx /etc/nginx/conf.d/app.conf.template
COPY docker/start-nginx.sh /usr/sbin/start

RUN chmod u+x /usr/sbin/start

EXPOSE 9000 443

WORKDIR ${APP_DIR}

CMD ["start"]
