import * as React from 'react';
import {View, Text} from 'react-native';
import {Switch, Icon} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';

import {BarOption} from '../components/baroption';

function SwitchBar({SettingTitle, icons, value, setter}) {
  const dispatch = useDispatch();
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  function capitalizeFirstLetter(str) {
    const string = String(str);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <BarOption
      darkMode={darkMode}
      left={
        <Icon
          name={value ? icons[0] : icons[1]}
          type="ionicon"
          color={darkMode ? 'white' : 'black'}
        />
      }
      text={SettingTitle}
      right={
        <View>
          <Text style={{color: darkMode ? 'white' : 'black'}}>
            {capitalizeFirstLetter(value)}
          </Text>
          <Switch
            value={value}
            onValueChange={newSetting => {
              dispatch(setter(newSetting));
            }}
          />
        </View>
      }
      onClick={() => {
        dispatch(setter(!value));
      }}
    />
  );
}
export default SwitchBar;
