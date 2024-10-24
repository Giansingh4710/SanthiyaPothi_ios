/* eslint-disable react-native/no-color-literals */
import * as React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import RNRestart from 'react-native-restart';

import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import SwitchBar from './settingBarSwitch';
// import SettingsBar from './settingBar';

import {setDarkMode} from '../../redux/actions';
import {allColors} from '../../assets/styleForEachOption';
import {setData, initialState} from '../../redux/reducers';
import {setTheState} from '../../redux/actions';
import {BarOption} from '../components/baroption.js';
import {deleteAllCache} from '../utils.js';

function SettingsPage({navigation}) {
  const state = useSelector(theState => theState.theReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: allColors[state.darkMode].headerColor,
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <SwitchBar
          SettingTitle="Dark Mode"
          icons={['moon', 'sunny']} //if true icon=moon, if false icon=sunny
          nameInState={'darkMode'} //only true or false
          setter={setDarkMode}
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
            name="trash-outline"
            type="ionicon"
            color={state.darkMode ? 'white' : 'black'}
          />
        }
        text="Delete Cache of All PDFs (Save Storage)"
        right={
          <Icon
            name="arrow-forward-outline"
            type="ionicon"
            color={state.darkMode ? 'white' : 'black'}
          />
        }
        onClick={() =>
          Alert.alert(
            'Are you Sure you want to Delete all the Cache?',
            'By clicking OK, you will save space by deleting all the PDFs that are saved on your phone',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  deleteAllCache();
                },
              },
            ],
          )
        }
      />
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
        onClick={() =>
          Alert.alert(
            'Are you Sure you want to reset all Data?',
            'This will delete all added pdfs , checked off boxes and last left off angs. Basically reset the App ',
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
                  deleteAllCache();
                  dispatch(setTheState(initialState));
                  RNRestart.Restart();
                },
              },
            ],
          )
        }
      />
    </View>
  );
}
export default SettingsPage;
