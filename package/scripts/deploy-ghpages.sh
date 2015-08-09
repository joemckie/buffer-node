#!/bin/bash

cd ../ &&
git checkout --orphan gh-pages &&
npm install -g esdoc &&
esdoc -c esdoc.json &&
git config user.name "Travis-CI" &&
git config user.email "travis@joemck.ie" &&
git add -A . &&
git commit -m "Documentation generated" &&
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" gh-pages > /dev/null 2>&1