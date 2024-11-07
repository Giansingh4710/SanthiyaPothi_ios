#!/bin/bash
function delete_if_exists() {
  if [ -e "$1" ]; then
    rm -rf "$1"
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

yarn cache clean
# npx react-native clean

yarn install
cd ios || exit
pod deintegrate
pod cache clean --all
# xcodebuild clean

pod install
statusCode=$?
if [[ $statusCode -ne 0 ]]; then
  echo "Pod install failed with status code: " $statusCode
  exit
fi
# open SanthiyaPothi.xcworkspace
cd ..
