#!/bin/bash

function delete_if_exists() {
  if [ -e $1 ]; then
    rm -rf $1
    echo "Deleted $1"
  else
    echo "$1 does not exist"
  fi
}

delete_if_exists node_modules
delete_if_exists yarn.json
delete_if_exists ios/Pods
delete_if_exists ios/Podfile.lock
delete_if_exists ios/build
delete_if_exists ~/Library/Developer/Xcode/DerivedData

cd ios || exit
pod deintegrate
pod cache clean --all
