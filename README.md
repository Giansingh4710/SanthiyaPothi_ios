
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



# Rand
    xcodebuild -workspace SanthiyaPothi.xcworkspace -configuration Debug -scheme SanthiyaPothi -destination id=1B5C08FB-6B72-4A50-A08E-6D7F3AA527BB

    yarn ios --simulator=”iPhone 11 Pro”
    yarn ios --simulator="6A38E35E-8B29-4117-88A6-211A323CD363"

    xcrun simctl list devices
    == Devices ==
    -- iOS 16.1 --
        iPhone SE (3rd generation) (6DDD2059-592D-4A9A-BA4F-8E67284156FF) (Shutdown) 
        iPhone 14 (1B5C08FB-6B72-4A50-A08E-6D7F3AA527BB) (Shutdown) 
        iPhone 14 Plus (E8E36D5A-C88C-4579-B10F-FA79EE8D910A) (Shutdown) 
        iPhone 14 Pro (6A38E35E-8B29-4117-88A6-211A323CD363) (Booted) 
        iPhone 14 Pro Max (6E02CAC7-A206-4EE6-A644-082D15593367) (Shutdown) 
        iPad Air (5th generation) (6889AF0C-0302-445D-A2EB-1823DD5EC5C7) (Shutdown) 
        iPad (10th generation) (92B25337-FD4C-4ADA-ACAC-D277CDC4B043) (Shutdown) 
        iPad mini (6th generation) (339D73BD-3D4B-4539-B23A-EE53CB6D2F36) (Shutdown) 
        iPad Pro (11-inch) (4th generation) (B8AA87C7-60CE-416F-80FD-4E4D896323EF) (Shutdown) 
        iPad Pro (12.9-inch) (6th generation) (8A6A0326-4DB9-4E4C-A888-565D29EC0598) (Shutdown) 
    -- Unavailable: com.apple.CoreSimulator.SimRuntime.iOS-16-0 --
        iphone8 (21FB9F29-6B24-44B4-9E85-1F6777A78442) (Shutdown) (unavailable, runtime profile not found)
        iPhone SE (3rd generation) (2B726763-C705-4816-90A4-2B1DFAF9373A) (Shutdown) (unavailable, runtime profile not found)
        iPhone 14 (3B10E0BE-ADED-48AF-8C6D-DA52390C1511) (Shutdown) (unavailable, runtime profile not found)
        iPhone 14 Plus (2D51644D-0495-4E5E-80E9-054CEFA185F3) (Shutdown) (unavailable, runtime profile not found)
        iPhone 14 Pro (D1B34873-F9B8-4413-BF53-BB5CA6B9844B) (Shutdown) (unavailable, runtime profile not found)
        iPhone 14 Pro Max (3E5C968D-7522-4D21-8762-98EA76D660BC) (Shutdown) (unavailable, runtime profile not found)
        iPad (9th generation) (D500ACB9-F690-4DA4-BA46-D361A02167D7) (Shutdown) (unavailable, runtime profile not found)
        iPad Pro (11-inch) (3rd generation) (9DE9DF78-E4B7-43E3-850E-0ACC39472351) (Shutdown) (unavailable, runtime profile not found)
        iPad Pro (12.9-inch) (5th generation) (7D2EDDBA-0B01-4817-B30E-0020B04BB698) (Shutdown) (unavailable, runtime profile not found)
        iPad Air (5th generation) (3BBF6A37-E954-4A1A-A901-CABF6BD40A50) (Shutdown) (unavailable, runtime profile not found)
        iPad mini (6th generation) (16777B90-D85A-495B-BF85-895A6615B04B) (Shutdown) (unavailable, runtime profile not found)

# For Fonts
    https://dev.to/mitchiemt11/custom-fonts-in-react-native-pro-tip-4693
        - Add this is 'react-native.config.js'
            ``` module.exports = {
                assets: ['./assets/fonts/'],
            }; ```
        - For each font file, click on "Get info" (mac) and name the ttf file the full name
        - npx react-native-asset
        - Use that name in the fontFamily property in the Text component
# Run
    yarn ios --simulator="iPhone 14"
