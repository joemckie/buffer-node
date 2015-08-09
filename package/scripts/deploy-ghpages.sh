#!/bin/bash

( cd ../../;
git checkout gh-pages;
cd package;
npm install;
grunt esdoc;
git config user.name "Travis-CI";
git config user.email "travis@joemck.ie";
git add -A .;
git commit -m "Documentation generated";
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)