import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Slider} from '@miblanchard/react-native-slider';
import {Icon, CheckBox} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';

import {setSettingsForTextBani} from '../../redux/actions.js';
import {setDarkMode} from '../../redux/actions';
import {useSelector, useDispatch} from 'react-redux';

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
      alignItems: 'center',
      justifyContent: 'center',
    },
    panelContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: '#ffffff', // Ensure the panel has a solid background
    },
  });

  return (
    <View style={styles.container}>
      <SwipeablePanel {...panelProps} isActive={bottomSheetOpen}>
        <View style={styles.panelContent}>
          <FontSlider
            fontSize={textBaniSettings.fontSize}
            setFontSize={value => updateSettings('fontSize', value)}
          />
          <SettingCheckbox
            title="Navigation Row On Top"
            val={textBaniSettings.navigationRowOnTop}
            setter={value => updateSettings('navigationRowOnTop', value)}
          />
          <SettingCheckbox
            title="Dark Mode"
            val={darkMode}
            setter={() => dispatch(setDarkMode(!darkMode))}
          />

          <ConditionalRender
            setting1={{
              title: 'Gurmukhi',
              val: textBaniSettings.gurmukhiOn,
              setter: () =>
                updateSettings('gurmukhiOn', !textBaniSettings.gurmukhiOn),
            }}
            setting2={{
              title: 'Larivaar',
              val: textBaniSettings.larivaarOn,
              setter: () =>
                updateSettings('larivaarOn', !textBaniSettings.larivaarOn),
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <TheSelect
              title="Transliterations"
              options={['', 'en', 'hi', 'ipa', 'ur']}
              value={textBaniSettings.transliterationType}
              setter={val => updateSettings('transliterationType', val)}
            />
            <TheSelect
              title="Visraam"
              options={['', 'igurbani', 'sttm', 'sttm2']}
              value={textBaniSettings.visraamType}
              setter={val => updateSettings('visraamType', val)}
            />
            <TheSelect
              title="Font "
              options={[
                'AmrLipiHeavy',
                'AnmolLipi',
                'Choti Script 7 Bold',
                'GHW Adhiapak Black',
                'GHW Adhiapak Bold',
                'GHW Adhiapak Book',
                'GHW Adhiapak Chisel Blk',
                'GHW Adhiapak Extra Light',
                'GHW Adhiapak Light',
                'GHW Adhiapak Medium',
              ]}
              value={textBaniSettings.fontType}
              setter={val => updateSettings('fontType', val)}
            />
          </View>

          <View style={{flexDirection: 'column'}}>
            <Text>Translations</Text>
            <TheSelect
              title="English Source"
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
              title="Punjabi Source"
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
              title="Spanish Source"
              options={['', 'bdb', 'ms', 'ssk']}
              value={textBaniSettings.translationType.es}
              setter={val =>
                updateSettings('translationType', {
                  ...textBaniSettings.translationType,
                  es: val,
                })
              }
            />
          </View>
        </View>
      </SwipeablePanel>
    </View>
  );
}

function TheSelect({title, options, setter, value}) {
  const dropdownRef = React.useRef(null);
  const styles = StyleSheet.create({
    cont: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 1,
      // width: '50%',
    },
    heading: {
      fontWeight: 'bold', // Makes the text bold
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      // lineHeight: 50, // Matches the height to center text vertically
    },
    dropdownButtonStyle: {
      width: 50,
      borderRadius: 5,
      // margin: 10,
      // paddingVertical: 3,
      // paddingHorizontal: 12,
      // borderRadius: 12,
      backgroundColor: '#E9ECEF',
      // flexDirection: 'row',
      // justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 12,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
      width: 350,
      left: 20,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  });

  React.useEffect(() => {
    const idxOfVal = options.indexOf(value);
    console.log(idxOfVal, value);
    dropdownRef?.current?.selectIndex(idxOfVal);
  }, [value]);

  return (
    <View style={styles.cont}>
      <Text style={styles.heading}>{title}:</Text>
      <SelectDropdown
        ref={dropdownRef}
        data={options}
        onSelect={(selectedItem, index) => {
          // setter(index);
          setter(selectedItem);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {selectedItem ? selectedItem : 'None'}
              </Text>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && {backgroundColor: '#D2D9DF'}),
              }}>
              <Text style={styles.dropdownItemTxtStyle}>
                {item ? item : 'None'}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={true}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );
}

function SettingCheckbox({title, val, setter}) {
  const styles = StyleSheet.create({
    cont: {flex: 1},
  });
  return (
    <View style={styles.cont}>
      <CheckBox
        checked={val}
        containerStyle={{
          margin: 0,
          padding: 0,
        }}
        size={20}
        uncheckedColor="#F00"
        checkedColor="#0F0"
        onPress={() => setter(!val)}
        textStyle={{
          color: 'black',
          fontSize: 12,
        }}
        title={title}
        // checkedTitle="ਸੰਪੂਰਨ"
      />
    </View>
  );
}

function ConditionalRender({setting1, setting2}) {
  const t1 = setting1.title;
  const v1 = setting1.val;
  const s1 = setting1.setter;
  const t2 = setting2.title;
  const v2 = setting2.val;
  const s2 = setting2.setter;

  const styles = StyleSheet.create({
    cont: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      // margin: 10,
      // padding: 10,
      // backgroundColor: 'red',
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666666',
    },
  });
  return (
    <View style={styles.cont}>
      <SettingCheckbox title={t1} val={v1} setter={s1} />
      {v1 && <SettingCheckbox title={t2} val={v2} setter={s2} />}
    </View>
  );
}

function FontSlider({fontSize, setFontSize}) {
  const styles = StyleSheet.create({
    fontCont: {
      width: '100%',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    slider: {
      backgroundColor: 'grey',
      flex: 1,
      /* left: 20, */
      borderRadius: 5,
      width: '90%',
      /* alignItems: 'center', */
    },
  });

  return (
    <View style={styles.fontCont}>
      <View style={styles.topRow}>
        <Icon
          name="remove-outline"
          type="ionicon"
          onPress={() => {
            if (fontSize > 7) {
              setFontSize(fontSize - 1);
            }
          }}
        />
        <Text>Font Size: {fontSize}</Text>
        <Icon
          // size={fontsz * 2}
          // color={state.darkMode ? 'white' : 'black'}
          name="add-outline"
          type="ionicon"
          onPress={() => {
            if (fontSize < 70) {
              setFontSize(fontSize + 1);
            }
          }}
        />
      </View>
      <View style={styles.slider}>
        <Slider
          minimumValue={0.07}
          maximumValue={0.7}
          value={fontSize / 100}
          onValueChange={value => {
            const newValue = Math.floor(value * 100);
            // const newValue = Math.floor(value);
            console.log('value', newValue);
            setFontSize(newValue);
          }}
        />
      </View>
    </View>
  );
}
