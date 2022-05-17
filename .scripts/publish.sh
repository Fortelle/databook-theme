#!/bin/bash
set -e

################
################

version_file="_includes/version"
release_file=".build/.release"

release_branch=$(git branch --show-current)

################
################

if ! [[ $release_branch =~ ^release\/* ]]
then
  echo "Error: The current branch is not release branch."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]
then
  echo "Error: There are uncommitted changes."
  exit 1
fi

################
################

git checkout master
git merge $release_branch
git push origin master
