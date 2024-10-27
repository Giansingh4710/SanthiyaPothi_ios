/* eslint-disable react-native/no-color-literals */
import React, {useRef, useEffect, useCallback} from 'react';
import {View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity} from 'react-native';
import RNRestart from 'react-native-restart';
import SelectDropdown from 'react-native-select-dropdown';

import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import SwitchBar from './settingBarSwitch';
// import SettingsBar from './settingBar';

import {setDarkMode, setCache} from '../../redux/actions';
import {allColors} from '../../assets/styleForEachOption';
import {setData, initialState} from '../../redux/reducers';
import {setTheState} from '../../redux/actions';
import {BarOption} from '../components/baroption.js';
import {deleteAllCache} from '../utils.js';

function SettingsPage({navigation}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const cacheType = useSelector(theState => theState.theReducer.cacheType);
  const dispatch = useDispatch();

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: allColors[darkMode].headerColor,
      },
      headerTintColor: darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: darkMode ? 'white' : 'black',
      },
    });
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[darkMode].mainBackgroundColor,
      height: '100%',
      paddingTop: '5%',
    },
    scroll: {
      width: '100%',
      // height: '100%',
    },
    bottom: {
      paddingBottom: '10%',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <SwitchBar
          SettingTitle="Dark Mode"
          icons={['moon', 'sunny']} //if true icon=moon, if false icon=sunny
          value={darkMode} //only true or false
          setter={setDarkMode}
        />

        <TheSelect
          title="Cache Type"
          options={['no-cache', 'force-cache']}
          value={cacheType}
          setter={val => setCache(val)}
        />
      </ScrollView>
      <View style={styles.bottom}>
        <BarOption
          darkMode={darkMode}
          left={<Icon name="trash-outline" type="ionicon" color={darkMode ? 'white' : 'black'} />}
          text="Delete Cache of All PDFs (Save Storage)"
          right={<Icon name="arrow-forward-outline" type="ionicon" color={darkMode ? 'white' : 'black'} />}
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
          darkMode={darkMode}
          left={<Icon name="alert-circle-outline" type="ionicon" color={darkMode ? 'white' : 'black'} />}
          text="Reset the State"
          right={<Icon name="arrow-forward-outline" type="ionicon" color={darkMode ? 'white' : 'black'} />}
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
    </View>
  );
}

function TheSelect({title, options, setter, value}) {
  const dropdownRef = React.useRef(null);
  const darkMode = useSelector(theState => theState.theReducer.darkMode);

  useEffect(() => {
    const idxOfVal = options.indexOf(value);
    if (idxOfVal !== -1) {
      dropdownRef?.current?.selectIndex(idxOfVal);
    }
  }, [value, options]);

  const renderButton = useCallback(
    (selectedItem, index) => {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: darkMode ? '#333' : '#E9ECEF',
            padding: 8,
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => dropdownRef.current.openDropdown()}>
          <Text
            style={{
              color: darkMode ? '#ffffff' : '#000000',
              fontSize: 13,
              fontWeight: '500',
            }}>
            {selectedItem || 'None'}
          </Text>
          <Icon name="chevron-down" type="feather" size={16} color={darkMode ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
      );
    },
    [darkMode, title],
  );

  const renderItem = useCallback(
    (item, index) => {
      return (
        <View
          style={{
            padding: 8,
            backgroundColor: darkMode ? '#444' : '#F8F9FA',
            borderBottomWidth: 1,
            borderBottomColor: darkMode ? '#555' : '#E9ECEF',
          }}>
          <Text style={{color: darkMode ? '#ffffff' : '#000000', fontSize: 12}}>{item || 'None'}</Text>
        </View>
      );
    },
    [darkMode],
  );

  return (
    <View style={{flexBasis: '48%', marginBottom: 10}}>
      <Text
        style={{
          color: darkMode ? '#ffffff' : '#000000',
          fontSize: 12,
          marginBottom: 5,
        }}>
        {title}
      </Text>
      <SelectDropdown
        ref={dropdownRef}
        data={options}
        onSelect={selectedItem => setter(selectedItem)}
        renderButton={renderButton}
        renderItem={renderItem}
      />
    </View>
  );
}
export default SettingsPage;
