#!/bin/bash

cd ../ &&
git checkout --orphan gh-pages &&
npm install -g esdoc &&
esdoc -c esdoc.json &&
git config user.name "Travis-CI" &&
git config user.email "travis@joemck.ie" &&
git add -A . &&
git commit -m "Documentation generated" &&
git push --force "https://${GH_TOKEN}@${GH_REF}" master:gh-pages