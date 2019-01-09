#!/bin/sh

# fetching env from vault file.
if test -d /var/run/secrets/nais.io/vault;
then
    for FILE in /var/run/secrets/nais.io/vault/*.env
    do
        for line in $(cat ${FILE}); do
            echo "- exporting `echo ${line} | cut -d '=' -f 1`"
            export ${line}
        done
    done
fi

export APP_DIR="${APP_DIR:-/app}"
export APP_HOSTNAME="${HOSTNAME:-localhost}"
export APP_NAME="${APP_NAME:-devimg}"
export APP_PORT="${APP_PORT:-443}"
export APP_VERSION="${APP_VERSION:-localhost}"
export REDIS_HOST="${REDIS_HOST:-0.0.0.0}"
export REDIS_PORT="${REDIS_PORT:-6379}"
export RESOLVER=$(cat /etc/resolv.conf | grep -v '^#' | grep -m 1 nameserver | awk '{print $2}') # Picking the first nameserver.
export SESSION_STORAGE="${SESSION_STORAGE:-redis}"


echo "Prefix:" $APP_PATH_PREFIX " Session Storage:" ${SESSION_STORAGE} " Resolver:" ${RESOLVER} " App version:" ${APP_VERSION}

# replace env for nginx conf
envsubst '$APP_DIR $APP_HOSTNAME $APP_NAME $APP_VERSION $APP_PORT $APP_CALLBACK_PATH $APP_PATH_PREFIX $OIDC_AGENTNAME $OIDC_PASSWORD $OIDC_HOST_URL $RESOLVER $REDIS_HOST $REDIS_PORT $SESSION_STORAGE' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf

# find all env start with APP_
export SUBS=$(echo $(env | cut -d= -f1 | grep "^APP_" | sed -e 's/^/\$/'))

# replace above envs
echo "inject envs: " ${SUBS}
for f in `find /${APP_DIR} -regex ".*\.\(js\|css\|html\|json\|map\)"`; do envsubst "$SUBS" < $f > $f.tmp; mv $f.tmp $f; done
for f in `find /nginx -regex ".*\.nginx"`; do envsubst "$SUBS" < $f > $f.tmp; mv $f.tmp $f; done
/usr/local/openresty/bin/openresty -g 'daemon off;'
exec "$@"
