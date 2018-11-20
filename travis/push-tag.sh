#!/bin/bash -e

PUSH_URL="https://x-access-token:$INSTALLATION_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
# If this is not a pull_request, the branch is master and its not tagged. Then create a new tag.
if [[ "${TRAVIS_PULL_REQUEST}" = "false" ]] && [[ "${TRAVIS_BRANCH}" = "master" ]] && [[ -z "${TRAVIS_TAG}" ]]; then
    yarn version --new-version patch --non-interactive
    git push --tags ${PUSH_URL} HEAD:master >/dev/null 2>&1
    echo "Pushing the new version to $TRAVIS_REPO_SLUG"
else
    echo "Will not bump version on branch ${TRAVIS_BRANCH} (Pull request: ${TRAVIS_PULL_REQUEST}, Tag: ${TRAVIS_TAG})"
fi
