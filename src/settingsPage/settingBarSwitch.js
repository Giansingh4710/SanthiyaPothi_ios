import * as React from 'react';
import {View, Text} from 'react-native';
import {Switch, Icon} from 'react-native-elements';

import {useDispatch, useSelector} from 'react-redux';

import {BarOption} from '../../assets/components/baroption';

function SwitchBar({SettingTitle, icons, nameInState, setter}) {
  const dispatch = useDispatch();
  const state = useSelector(theState => theState.theReducer);
  function capitalizeFirstLetter(str) {
    const string = String(str);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const settingOnOff = state[nameInState];

  return (
    <BarOption
      state={state}
      height={95}
      left={
        <Icon
          name={settingOnOff ? icons[0] : icons[1]}
          type="ionicon"
          color={state.darkMode ? 'white' : 'black'}
        />
      }
      text={SettingTitle}
      right={
        <View>
          <Text style={{color: state.darkMode ? 'white' : 'black'}}>
            {capitalizeFirstLetter(settingOnOff)}
          </Text>
          <Switch
            value={settingOnOff}
            onValueChange={newSetting => {
              dispatch(setter(newSetting));
            }}
          />
        </View>
      }
      onClick={() => {
        console.log(SettingTitle, ':', settingOnOff);
        dispatch(setter(!settingOnOff));
      }}
    />
  );
}
export default SwitchBar;
