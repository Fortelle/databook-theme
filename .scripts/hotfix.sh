#!/bin/bash
set -e

################
################

if [ "$(git branch --show-current)" != "develop" ]
then
  echo "Error: The current branch is not 'develop'."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]
then
  echo "Error: There are uncommitted changes."
  exit 1
fi

if ! ( bundle exec jekyll build --quiet )
then
  echo "Error: Failed to build the site."
  exit 1
fi

################
################

git checkout master
git merge develop
git push origin master
git push origin develop
git checkout develop
