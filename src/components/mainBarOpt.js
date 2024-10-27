import {TouchableOpacity, View} from 'react-native';
import {BarOption} from './baroption.js';
import {Icon, CheckBox} from 'react-native-elements';

export function MainBar({
  darkMode,
  isFolder,
  text,
  checked,
  onCheckBoxClick,
  onClick,
  isStared,
  onStarClick,
}) {
  return (
    <BarOption
      darkMode={darkMode}
      onClick={onClick}
      height={50}
      fontSize={16}
      text={text}
      left={
        <Icon
          name={isFolder ? 'folder-outline' : 'document-outline'}
          type="ionicon"
          color={darkMode ? 'white' : 'black'}
        />
      }
      right={
        isFolder ? (
          <Icon
            name="arrow-forward-outline"
            type="ionicon"
            color={darkMode ? 'white' : 'black'}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              height: '100%',
            }}>
            <CheckBox
              checked={checked}
              containerStyle={{
                margin: 0,
                padding: 0,
                paddingTop: 5,
              }}
              size={20}
              uncheckedColor="#F00"
              checkedColor="#0F0"
              onPress={onCheckBoxClick}
            />
            <TouchableOpacity onPress={onStarClick}>
              <Icon
                name={isStared ? 'star' : 'star-outline'}
                type="ionicon"
                color={darkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>
        )
      }
    />
  );
}
