#!/bin/bash
set -e

################
################

version_file="_includes/version"
release_file=".build/.release"

version_type=$1

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

if ! [ -f $version_file ]
then
  echo "Error: File '$version_file' does not exist."
  exit 1
fi

#if ! ( git diff --quiet master -- $version_file )
#then
#  exit 1
#fi

if ! ( bundle exec jekyll build --quiet )
then
  echo "Error: Failed to build the site."
  exit 1
fi

################
################

read old_version < $version_file || true
old_version=${old_version//[$'\t\r\n ']}
version_parts=(${old_version//"."/ })
case $version_type in
  "major")
    version_parts[0]=$((version_parts[0]+1))
    version_parts[1]=0
    version_parts[2]=0
    echo "major"
    ;;
  "minor")
    version_parts[1]=$((version_parts[1]+1))
    version_parts[2]=0
    echo "minor"
    ;;
  "patch")
    version_parts[2]=$((version_parts[2]+1))
    echo "patch"
    ;;
esac
new_version="${version_parts[0]}.${version_parts[1]}.${version_parts[2]}"

release_branch="release/$new_version"
echo "Old version: $old_version"
echo "New version: $new_version"

if ( git show-ref --quiet $release_branch )
then
  echo "Error: Branch '$release_branch' already exists."
  exit 1
fi

################
################

if [ $old_version != $new_version ]
then
  echo ${new_version} > $version_file
  git add .
  git commit -m "Update version to $new_version"
fi

git tag v$new_version
git checkout -b $release_branch master
git merge develop
