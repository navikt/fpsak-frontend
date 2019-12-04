FROM nginx
ADD k8s/proxy.nginx /etc/nginx/conf.d/app.conf.template

ENV APP_DIR="/app" \
	APP_PATH_PREFIX="/fpsak" \
	APP_CALLBACK_PATH="/fpsak/cb" \
	APP_URL_FPTILBAKE="http://fptilbake" \
	APP_URL_FPOPPDRAG="http://fpoppdrag" \
	APP_URL_FPSAK="http://fpsak"

COPY dist /usr/share/nginx/html

EXPOSE 9000 443

# using bash over sh for better signal-handling
SHELL ["/bin/bash", "-c"]
ADD start-server.sh /start-server.sh
CMD /start-server.sh
