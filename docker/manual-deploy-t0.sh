#!/usr/bin/env bash

kubectl config use-context preprod-fss
export RELEASE_VERSION="v$(date +%Y%m%d%H%M)"
docker build . -t docker.adeo.no:5000/fpsak-frontend-test:${RELEASE_VERSION} -f ./docker/Dockerfile --build-arg HTTP_PROXY=${HTTP_PROXY} --build-arg HTTPS_PROXY=${HTTP_PROXY}
docker push docker.adeo.no:5000/fpsak-frontend-test:${RELEASE_VERSION}
echo "Pushed docker.adeo.no:5000/fpsak-frontend-test:${RELEASE_VERSION}"
sed "s/RELEASE_VERSION/${RELEASE_VERSION}/g" docker/app-t0.yaml | kubectl apply -f -
