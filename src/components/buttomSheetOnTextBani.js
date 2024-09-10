import React, {useState} from 'react';
import {StyleSheet, Image, Text, View, TouchableOpacity} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Slider} from '@miblanchard/react-native-slider';
import {Switch, Icon, CheckBox} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';

function ButtomSheet({
  setButtomSheet,
  bottomSheetOpen,
  setFontSize,
  fontSize,

  gurmukhiOn,
  setGurmukhiOn,
  translationType,
  setTranslations,
  larivaarOn,
  setLarivaarOn,
  transliterationType,
  setTransliteration,
  navigationRowOnTop,
  setNavigationRow,

  visraamType,
  setVisraam,
  fontType,
  setFont,
}) {
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: !true,
    // onlyLarge: true,
    // onlySmall: true,
    showCloseButton: true,
    onClose: () => {
      setButtomSheet(false);
    },
    onPressCloseButton: () => setButtomSheet(false),
  });

  const [transliterationOpen, setTransliterationOpen] = useState(false);

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
          <FontSlider fontSize={fontSize} setFontSize={setFontSize} />
          <SettingCheckbox
            title="Navigation Row On Top"
            val={navigationRowOnTop}
            setter={setNavigationRow}
          />
          <ConditionalRender
            setting1={{
              title: 'Gurmukhi',
              val: gurmukhiOn,
              setter: setGurmukhiOn,
            }}
            setting2={{
              title: 'Larivaar',
              val: larivaarOn,
              setter: setLarivaarOn,
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <TheSelect
              title="Transliterations"
              options={['', 'en', 'hi', 'ipa', 'ur']}
              setter={setTransliteration}
              value={transliterationType}
            />
            <TheSelect
              title="Visraam"
              options={['', 'igurbani', 'sttm', 'sttm2']}
              setter={setVisraam}
              value={visraamType}
            />
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text>Translations</Text>
            <TheSelect
              title="English Source"
              options={['', 'bdb', 'ms', 'ssk']}
              value={translationType.en}
              setter={input => setTranslations(old => ({...old, en: input}))}
            />
            <TheSelect
              title="Punjabi Source"
              options={['', 'bdb', 'ms', 'ssk']}
              value={translationType.pu}
              setter={input => setTranslations(old => ({...old, pu: input}))}
            />
            <TheSelect
              title="Spanish Source"
              options={['', 'bdb', 'ms', 'ssk']}
              value={translationType.es}
              setter={input => setTranslations(old => ({...old, es: input}))}
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


function InputSelectOne({title, opts, selected, setter}) {
  const styles = StyleSheet.create({
    cont: {
      alignItems: 'flex-start',
      // padding: 0,
    },
    heading: {
      flexDirection: 'row',
      paddingLeft: 5,
      alignItems: 'center',
      fontWeight: 'bold', // This makes the text bold
    },
    checks: {
      flexDirection: 'row',
      // marginRight: 1,
    },
  });

  return (
    <View style={styles.cont}>
      <View style={styles.heading}>
        <Text style={{fontWeight: 'bold'}}>{title}:</Text>
      </View>
      <View style={styles.checks}>
        {opts.map((opt, idx) => (
          <SettingCheckbox
            key={idx}
            title={opt === '' ? 'None' : opt}
            val={opt === selected}
            setter={() => {
              if (opt === selected)
                setter(''); // make it blank is same clicked
              else setter(opt);
            }}
          />
        ))}
      </View>
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

function Switcher({title, value, setter}) {
  const styles = StyleSheet.create({
    cont: {
      flexDirection: 'row',
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      color: '#666666',
    },
  });
  return (
    <View style={styles.cont}>
      <Text style={styles.text}>{title}:</Text>
      <Switch
        value={value}
        onValueChange={newSetting => {
          setter(newSetting);
        }}
      />
    </View>
  );
}

function SelectFont() {
  return (
    <View className="flex flex-col items-center">
      <select
        className="m-1 p-1  border border-sky-500 rounded bg-white text-black text-xs"
        value={selectedFont}
        onChange={event => {
          setFont(event.currentTarget.value);
        }}>
        {fonts.map((fontName, idx) => (
          <option key={idx} value={fontName}>
            Font: {fontName}
          </option>
        ))}
      </select>

      <View>
        <Picker
          ref={pickerRef}
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) => setSelectedLanguage('java')}>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>

        <TouchableOpacity
          onClick={() => {
            pickerRef.current.focus();
          }}>
          <Text>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onClick={() => {
            pickerRef.current.blur();
          }}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
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
          // color={state.darkMode ? 'white' : 'black'}
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

export default ButtomSheet;
