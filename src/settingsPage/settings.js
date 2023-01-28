/* eslint-disable react-native/no-color-literals */
import * as React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import RNRestart from 'react-native-restart';

import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import SwitchBar from './settingBarSwitch';
// import SettingsBar from './settingBar';
import {heightOfBar} from '../utils.js';

import {setDarkMode, setHideHeader, setShowHeader} from '../../redux/actions';
import {allColors} from '../../assets/styleForEachOption';
import {setData, initialState} from '../../redux/reducers';
import {setTheState} from '../../redux/actions';
import {BarOption} from '../../assets/components/baroption';

function SettingsPage({navigation}) {
  const state = useSelector(theState => theState.theReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: allColors[state.darkMode].headerColor,
        height: heightOfBar(),
      },
      headerTintColor: state.darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: state.darkMode ? 'white' : 'black',
      },
    });
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
      height: '100%',
      paddingTop: '5%',
    },
    scroll: {
      width: '100%',
      // height: '100%',
    },
  });
  const createThreeButtonAlert = () =>
    Alert.alert(
      'Are you Sure you want to reset all Data?',
      'This will delete all added pdfs , checked off boxes and last left off angs',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setData('state', initialState);
            dispatch(setTheState(initialState));
            RNRestart.Restart();
          },
        },
      ],
    );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <SwitchBar
          SettingTitle="Dark Mode"
          icons={['moon', 'sunny']} //if true icon=moon, if false icon=sunny
          nameInState={'darkMode'} //only true or false
          setter={setDarkMode}
        />
        <SwitchBar
          SettingTitle="Hide Header On Scroll"
          icons={['chevron-up-circle', 'close-outline']}
          nameInState={'hideHeaderOnScroll'}
          setter={setHideHeader}
        />
        <SwitchBar
          SettingTitle="Show Header On Scroll"
          icons={['chevron-down-circle', 'close-outline']}
          nameInState={'showHeaderOnScroll'}
          setter={setShowHeader}
        />
        {/* <SettingsBar
          theSetting="Type of Words"
          theList={['Both', 'Gurbani', 'Punjabi']} // the 0 index in theList is the default setting
          imageSource="khalislogo150"
          theAction={setTypeOfWords} // setTypeOfWords take 1 param, both,gurbani or punjabi,
          theCurrentOptionIndex={['Both', 'Gurbani', 'Punjabi'].indexOf(
            state.typesOfWords,
          )}
        />
        <SwitchBar
          theSetting="Show Pop Up after each word"
          theList={[true, false]}
          imageSource="ikOngkar"
          theAction={setShowPopUp} // setTypeOfWords take 1 param, both,gurbani or punjabi,
          theCurrentOptionIndex={[true, false].indexOf(state.showPopUp)}
        /> */}
      </ScrollView>
      <BarOption
        state={state}
        height={95}
        left={
          <Icon
            name="alert-circle-outline"
            type="ionicon"
            color={state.darkMode ? 'white' : 'black'}
          />
        }
        text="Reset the State"
        right={
          <Icon
            name="arrow-forward-outline"
            type="ionicon"
            color={state.darkMode ? 'white' : 'black'}
          />
        }
        onClick={() => createThreeButtonAlert()}
      />
    </View>
  );
}
export default SettingsPage;
