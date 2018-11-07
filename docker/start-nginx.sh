#!/bin/sh

# Picking the first nameserver.
export RESOLVER=$(cat /etc/resolv.conf | grep -v '^#' | grep -m 1 nameserver | awk '{print $2}')
echo "Will use resolver:" $RESOLVER

# replace env for nginx conf
envsubst '$WHITE_LIST $WHITE_LIST_IP $DEBUG $APP_DIR $APP_PATH_PREFIX $APP_API_PLACEHOLDER $APP_API_GATEWAY $CLIENT_BODY_TIMEOUT $CLIENT_HEADER_TIMEOUT $CLIENT_MAX_BODY_SIZE $OIDC_AGENTNAME $OIDC_PASSWORD $OIDC_HOST_URL $RESOLVER $APP_NAME $APP_VERSION $FASIT_ENVIRONMENT_NAME' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/fpsak.conf

# find all env start with APP_
export SUBS=$(echo $(env | cut -d= -f1 | grep "^APP_" | sed -e 's/^/\$/'))

# replace above envs
echo "inject envs: " $SUBS
for f in `find /$APP_DIR -regex ".*\.\(js\|css\|html\|json\|map\)"`; do envsubst "$SUBS" < $f > $f.tmp; mv $f.tmp $f; done

/usr/local/openresty/bin/openresty -g 'daemon off;'
exec "$@"
