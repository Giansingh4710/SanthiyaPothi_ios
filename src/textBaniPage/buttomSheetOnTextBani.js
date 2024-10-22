import React, {useCallback, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Slider} from '@miblanchard/react-native-slider';
import {Icon, CheckBox} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector, useDispatch} from 'react-redux';
import {setSettingsForTextBani, setDarkMode} from '../../redux/actions';
import {initialState} from '../../redux/reducers';

export default function ButtomSheet({setBottomSheetOpen, bottomSheetOpen}) {
  const dispatch = useDispatch();
  const textBaniSettings = useSelector(
    theState => theState.theReducer.textBaniSettings,
  );
  const darkMode = useSelector(theState => theState.theReducer.darkMode);

  const updateSettings = useCallback(
    (key, value) => {
      dispatch(setSettingsForTextBani({...textBaniSettings, [key]: value}));
    },
    [dispatch, textBaniSettings],
  );

  const panelProps = {
    fullWidth: true,
    openLarge: false,
    showCloseButton: true,
    onClose: () => setBottomSheetOpen(false),
    onPressCloseButton: () => setBottomSheetOpen(false),
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#121212' : '#f8f9fa',
    },
    panelContent: {
      flex: 1,
      padding: 10,
    },
    sectionTitle: {
      color: darkMode ? '#ffffff' : '#000000',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    section: {
      // marginBottom: 15,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingBottom: 5,
    },
    wrapRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <SwipeablePanel
        {...panelProps}
        isActive={bottomSheetOpen}
        style={{
          backgroundColor: darkMode ? '#1f1f1f' : '#ffffff',
        }}>
        <View style={styles.panelContent}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.section}>
            <FontSlider
              fontSize={textBaniSettings.fontSize}
              setFontSize={value => updateSettings('fontSize', value)}
              darkMode={darkMode}
            />
          </View>

          <View style={[styles.section, styles.row]}>
            <SettingCheckbox
              title="Nav Row Top"
              val={textBaniSettings.navigationRowOnTop}
              setter={value => updateSettings('navigationRowOnTop', value)}
            />
            <SettingCheckbox
              title="Dark Mode"
              val={darkMode}
              setter={() => dispatch(setDarkMode(!darkMode))}
            />

            <SettingCheckbox
              title="Bani In Parts"
              val={textBaniSettings.baniInParts}
              setter={() =>
                updateSettings('baniInParts', !textBaniSettings.baniInParts)
              }
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Text Manipulation</Text>
            <View style={styles.wrapRow}>
              <TheSelect
                title="Visraam Data from"
                options={['', 'igurbani', 'sttm', 'sttm2']}
                value={textBaniSettings.visraamType}
                setter={val => updateSettings('visraamType', val)}
              />
              <TheSelect
                title="Font"
                options={[
                  'AmrLipiHeavy',
                  'AnmolLipi',
                  'Choti Script 7 Bold',
                  'GHW Adhiapak Black',
                  'GHW Adhiapak Bold',
                  'GHW Adhiapak Book',
                ]}
                value={textBaniSettings.fontType}
                setter={val => updateSettings('fontType', val)}
              />

              <TheSelect
                title="English Translation"
                options={['', 'bdb', 'ms', 'ssk']}
                value={textBaniSettings.translationType.en}
                setter={val =>
                  updateSettings('translationType', {
                    ...textBaniSettings.translationType,
                    en: val,
                  })
                }
              />
              <TheSelect
                title="Punjabi Translation"
                options={['', 'bdb', 'ms', 'ssk']}
                value={textBaniSettings.translationType.pu}
                setter={val =>
                  updateSettings('translationType', {
                    ...textBaniSettings.translationType,
                    pu: val,
                  })
                }
              />
              <TheSelect
                title="Spanish Translation"
                options={['', 'sn']}
                value={textBaniSettings.translationType.es}
                setter={val =>
                  updateSettings('translationType', {
                    ...textBaniSettings.translationType,
                    es: val,
                  })
                }
              />
              <TheSelect
                title="Transliterations"
                options={['', 'en', 'hi', 'ipa', 'ur']}
                value={textBaniSettings.transliterationType}
                setter={val => updateSettings('transliterationType', val)}
              />
            </View>
          </View>

          <View style={[styles.section, styles.wrapRow]}>
            <SettingCheckbox
              title="Show Gurmukhi"
              val={textBaniSettings.gurmukhiOn}
              setter={() =>
                updateSettings('gurmukhiOn', !textBaniSettings.gurmukhiOn)
              }
            />
            {textBaniSettings.gurmukhiOn && (
              <SettingCheckbox
                title="Larivaar"
                val={textBaniSettings.larivaarOn}
                setter={() =>
                  updateSettings('larivaarOn', !textBaniSettings.larivaarOn)
                }
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress Bars</Text>
            <SettingCheckbox
              title="Progress Bar For Current Display"
              val={textBaniSettings.showProgressBarForDisplayLines}
              setter={value =>
                updateSettings('showProgressBarForDisplayLines', value)
              }
            />
            <SettingCheckbox
              title="Progress Bar for Whole Bani"
              val={textBaniSettings.showProgressBarForWholeBani}
              setter={value =>
                updateSettings('showProgressBarForWholeBani', value)
              }
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={{
                backgroundColor: darkMode ? '#333' : '#E9ECEF',
                padding: 8,
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => {
                Alert.alert(
                  'Are you Sure you want to reset the settings?',
                  'By clicking OK, you will reset all the settings here to default.',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        dispatch(
                          setSettingsForTextBani(initialState.textBaniSettings),
                        );
                      },
                    },
                  ],
                );
              }}>
              <Text
                style={{
                  color: darkMode ? '#ffffff' : '#000000',
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                Reset Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SwipeablePanel>
    </View>
  );
}

function TheSelect({title, options, setter, value}) {
  const dropdownRef = useRef(null);
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
          <Icon
            name="chevron-down"
            type="feather"
            size={16}
            color={darkMode ? '#ffffff' : '#000000'}
          />
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
          <Text style={{color: darkMode ? '#ffffff' : '#000000', fontSize: 12}}>
            {item || 'None'}
          </Text>
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

function FontSlider({fontSize, setFontSize, darkMode}) {
  const styles = StyleSheet.create({
    cont: {
      flex: 1,
    },
    rowAbove: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    btn: {
      flex: 1,
      backgroundColor: darkMode ? '#333' : '#E9ECEF',
      padding: 2,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

  const [localFontSize, setLocalFontSize] = React.useState(fontSize);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      setFontSize(localFontSize);
    }, 300);

    return () => clearTimeout(debounce);
  }, [localFontSize, setFontSize]);

  return (
    <View style={styles.cont}>
      <View style={styles.rowAbove}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (localFontSize > 7) setLocalFontSize(prev => prev - 1);
          }}>
          <Icon
            name="remove-outline"
            type="ionicon"
            color={darkMode ? '#ffffff' : '#000000'}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: darkMode ? '#ffffff' : '#000000',
            flex: 1,
            textAlign: 'center',
          }}>
          Font Size: {localFontSize}
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (localFontSize < 70) setLocalFontSize(prev => prev + 1);
          }}>
          <Icon
            style={{flex: 1}}
            name="add-outline"
            type="ionicon"
            color={darkMode ? '#ffffff' : '#000000'}
          />
        </TouchableOpacity>
      </View>
      <Slider
        minimumValue={7}
        maximumValue={70}
        value={localFontSize}
        onValueChange={value => setLocalFontSize(Math.floor(value))}
        thumbTintColor={darkMode ? '#ffffff' : '#000000'}
        step={1}
      />
    </View>
  );
}

function SettingCheckbox({title, val, setter}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  return (
    <CheckBox
      title={title}
      checked={val}
      containerStyle={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        margin: 0,
        padding: 0,
      }}
      textStyle={{color: darkMode ? '#ffffff' : '#000000', fontSize: 12}}
      onPress={() => setter(!val)}
      checkedColor={darkMode ? '#76ff03' : '#00ff00'}
      uncheckedColor={darkMode ? '#ff1744' : '#ff0000'}
    />
  );
}

function ConditionalRender({setting1, setting2, darkMode}) {
  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'space-between'}}></View>
  );
}
