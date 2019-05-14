#!/usr/bin/env bash

kubectl config use-context preprod-fss
export DOCKER_REPO="repo.adeo.no:5443"
export APPLICATION_NAME="fpsak-frontend"
export RELEASE_VERSION="test$(date +%Y%m%d%H%M)"

docker build . -t ${DOCKER_REPO}/${APPLICATION_NAME}:${RELEASE_VERSION}
docker push ${DOCKER_REPO}/${APPLICATION_NAME}:${RELEASE_VERSION} 2>&1; rc=$?;
if [[ $rc != 0 ]]; then
	exit 1
fi
echo "Pushed ${DOCKER_REPO}/${APPLICATION_NAME}:${RELEASE_VERSION}"
export PROPFILE="./k8s/application.test.variabler.properties"
export REPLACEMENTS="s/RELEASE_VERSION/${RELEASE_VERSION}/g"
for line in $(cat ${PROPFILE}); do
    export REPLACEMENTS="${REPLACEMENTS}; s%${line/=/%}%g"
done
sed "$REPLACEMENTS" k8s/app.yaml | kubectl apply -f -
kubectl rollout status -nt4 deployment/${APPLICATION_NAME}
