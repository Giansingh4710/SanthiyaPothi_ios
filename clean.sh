#!/bin/bash

function delete_if_exists() {
  if [ -e "$1" ]; then
    rm -rf "$1"
    echo "Deleted $1"
  else
    echo "$1 does not exist"
  fi
}

yarn cache clean
cd ios || exit
pod deintegrate
pod cache clean --all
cd ..

delete_if_exists node_modules
delete_if_exists yarn.json
delete_if_exists ios/Pods
delete_if_exists ios/Podfile.lock
delete_if_exists ios/build
delete_if_exists ~/Library/Developer/Xcode/DerivedData

yarn install

cd ios || exit
pod install
statusCode=$?
if [[ $statusCode -ne 0 ]]; then
  echo "Pod install failed with status code: " $statusCode

  exit
fi
open SanthiyaPothi.xcworkspace
cd ..

# read -p "Do you want to open Xcode? (y/n) " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Yy]$ ]]
# then
# fi
