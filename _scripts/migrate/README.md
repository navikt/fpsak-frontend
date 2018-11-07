


Starte på nytt

git checkout fpsak-master
git reset --hard origin/master
node ./sync-fpsak-frontend/find-imports
node ./sync-fpsak-frontend/overwrite-with-prod
node ./sync-fpsak-frontend/fix-paths
