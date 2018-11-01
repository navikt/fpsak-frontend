FROM zzswang/docker-nginx-react:latest
COPY ./dist /app
ENV DEBUG=on \
    APP_API_PLACEHOLDER="/fpsak" \
    CLIENT_HEADER_TIMEOUT=5 \
    CLIENT_BODY_TIMEOUT=5
COPY docker/nginx-site.conf /etc/nginx/conf.d/app.conf.template
EXPOSE 9000
