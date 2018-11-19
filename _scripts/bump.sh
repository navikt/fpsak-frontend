
PUSH_URL="https://x-access-token:$INSTALLATION_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"

if [[ "${TRAVIS_PULL_REQUEST}" = "false" ]] && [[ "${TRAVIS_BRANCH}" = "master" ]]; then
    yarn version --patch --non-interactive
    git push "${PUSH_URL}" --tags >/dev/null 2>&1
fi
