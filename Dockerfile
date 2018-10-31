FROM zzswang/docker-nginx-react:latest
COPY ./dist /app
ENV DEBUG="ON" \
    APP_API_PLACEHOLDER="/fpsak" \
    CLIENT_HEADER_TIMEOUT=100 \
    CLIENT_BODY_TIMEOUT=100
COPY docker/nginx-site.conf /etc/nginx/conf.d/app.conf.template
EXPOSE 9000
