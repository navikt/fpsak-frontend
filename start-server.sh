#!/usr/bin/env bash
set -e

_shutdown_() {
  # https://github.com/kubernetes/contrib/issues/1140
  # https://github.com/kubernetes/kubernetes/issues/43576
  # https://github.com/kubernetes/kubernetes/issues/64510
  # https://nav-it.slack.com/archives/C5KUST8N6/p1543497847341300
  echo "shutdown initialized, allowing incoming requests for 5 seconds before continuing"
  sleep 5
  nginx -s quit
  wait "$pid"
}
trap _shutdown_ SIGTERM

export APP_HOSTNAME="${HOSTNAME:-localhost}"
export APP_PORT="${APP_PORT:-443}"
export APP_NAME="${APP_NAME:-devimg}"
export APP_VERSION="${APP_VERSION:-localhost}"

envsubst 'APP_URL $APP_PORT $APP_HOSTNAME $APP_NAME $APP_VERSION $APP_PATH_PREFIX' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf

cat /etc/nginx/conf.d/default.conf

nginx -g "daemon off;" &
pid=$!
wait "$pid"
