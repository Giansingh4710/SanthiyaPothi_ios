
# Errors Faced:
    When I Build by pressing Play button in Xcode, I faced the following error:
        FBReactNativeSpec/FBReactNativeSpec.h:2216:46 'value' is unavailable: introduced in iOS 12.0
    Solution:
        https://github.com/facebook/react-native/issues/34106#issuecomment-1179485220
            1. changed to ```react-native": "0.69.0"``` in package.json (was '0.70.2' before)
            2. go to file node_modules/react-native/scripts/react_native_pods.rb
            3. Go to line no 401 >>> 'ios' => '11.0',
            4. Change 11.0 to 12.0
            4. Run yarn
            5. Run 'cd ios && pod install && cd ..'
            6. Go to ios/build/generated/ios/React-Codegen.podspec.json and confirm "platforms": { "ios": "12.0" }
            
            (Just doing this didn't work. I used chatGPT and changed the ./ios/Podfile and then did pod install (and mool mantar) and then it worked)



# Run
    yarn ios --simulator="iPhone 14"
