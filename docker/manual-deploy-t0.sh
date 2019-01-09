#!/usr/bin/env bash

export RELEASE_VERSION="v$(date +%Y%m%d%H%I)"

#echo
#yarn build

docker build . -t docker.adeo.no:5000/fpsak-frontend-test:${RELEASE_VERSION} -f ./docker/DockerfileDev --build-arg HTTP_PROXY=${HTTP_PROXY} --build-arg HTTPS_PROXY=${HTTP_PROXY}
docker push docker.adeo.no:5000/fpsak-frontend-test:${RELEASE_VERSION}
echo "Pushed docker.adeo.no:5000/fpsak-frontend-test:${RELEASE_VERSION}"
sed "s/RELEASE_VERSION/${RELEASE_VERSION}/g" docker/app-t1.yaml | kubectl apply -f -
