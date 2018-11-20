#!/bin/bash -e

PUSH_URL="https://x-access-token:$INSTALLATION_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"

if [[ "${TRAVIS_PULL_REQUEST}" = "false" ]] && [[ "${TRAVIS_BRANCH}" = "master" ]]; then
    yarn version --new-version patch --non-interactive
    git push "${PUSH_URL}" HEAD:master --tags >/dev/null 2>&1
    echo "Pushing the new version to $TRAVIS_REPO_SLUG"
else
    echo "Will not bump version on branch ${TRAVIS_BRANCH} (Pull request: ${TRAVIS_PULL_REQUEST})"
fi
