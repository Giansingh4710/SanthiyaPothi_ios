import React, {useState, useEffect, useMemo, useRef} from 'react';
import {FlashList} from '@shopify/flash-list';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {bani_partitions} from '../assets/longData_text.js';
import {banis_api_data} from '../assets/text_banis_data.js';
import {allColors} from '../assets/styleForEachOption.js';
import {incrementKey} from '../assets/helper_funcs.js';

import {setSettingsForTextBani} from '../redux/actions.js';
import {useSelector, useDispatch} from 'react-redux';

import SelectDropdown from 'react-native-select-dropdown';

import ButtomSheet from './components/buttomSheetOnTextBani.js';

export default function OpenTxtBaniScreen({navigation, route}) {
  const {bani_token, dataObj, token_index} = route.params;
  const [currPartitionIdx, setCurrPartitionIdx] = useState(0);
  const partitions = useMemo(() => {
    return bani_token in bani_partitions ? bani_partitions[bani_token] : [0];
  }, [bani_token]);

  const bani_data = banis_api_data[bani_token];
  bani_data.verses = bani_data.verses.filter(
    verse => verse.mangalPosition !== 'above',
  );

  let current_verses = [];
  if (currPartitionIdx === partitions.length - 1)
    current_verses = bani_data.verses.slice(partitions[currPartitionIdx]);
  else {
    current_verses = bani_data.verses.slice(
      partitions[currPartitionIdx],
      partitions[currPartitionIdx + 1],
    );
  }

  const dispatch = useDispatch();
  const settings = useSelector(
    theState => theState.theReducer.textBaniSettings,
  );

  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [gurmukhiOn, setGurmukhiOn] = useState(settings.gurmukhiOn);
  const [larivaarOn, setLarivaarOn] = useState(settings.larivaarOn);
  const [translationType, setTranslations] = useState(settings.translationType);
  const [fontType, setFont] = useState(settings.fontType);
  const [visraamType, setVisraam] = useState(settings.visraamType);

  const [transliterationType, setTransliteration] = useState(
    settings.transliterationType,
  );
  const [navigationRowOnTop, setNavigationRow] = useState(
    settings.navigationRowOnTop,
  );

  useEffect(() => {
    dispatch(
      setSettingsForTextBani({
        fontSize,
        gurmukhiOn,
        larivaarOn,
        translationType,
        transliterationType,
        fontType,
        visraamType,
        navigationRowOnTop,
      }),
    );
  }, [
    gurmukhiOn,
    translationType,
    larivaarOn,
    fontSize,
    transliterationType,
    navigationRowOnTop,
    fontType,
    visraamType,
  ]);

  const state = useSelector(theState => theState.theReducer);

  const [bottomSheetOpen, setButtomSheet] = useState(false);
  const [highlightNextBtnOn, setHighlightNextBtn] = useState(false);

  useEffect(() => {
    const title = bani_data.baniInfo.unicode;
    const showTitle = title.length > 15 ? title.slice(0, 15) + '...' : title;
    navigation.setOptions({
      title: showTitle,
      headerStyle: {
        backgroundColor: allColors[state.darkMode].headerColor,
      },
      headerContainerStyle: {padding: 50},
      headerTintColor: state.darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: state.darkMode ? 'white' : 'black',
      },
      headerRight: () => {
        const options = partitions.map((verseIdx, idx) => {
          let title = bani_data.verses[verseIdx].verse.verse.unicode;
          if (0 !== bani_data.verses[verseIdx].header) {
            for (let i = 0; i < 3; i++) {
              title = bani_data.verses[verseIdx + i].verse.verse.unicode;
              if (0 === bani_data.verses[verseIdx + i].header) {
                break;
              }
            }
          }
          return {title: `${idx + 1}: ${title}`};
        });
        return (
          <View>
            <Icon type="" />
            <TheSelect
              options={options}
              setCurrPartitionIdx={setCurrPartitionIdx}
              currPartitionIdx={currPartitionIdx}
              darkMode={state.darkMode}
            />
          </View>
        );
      },
    });
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
      height: '100%',
    },
    displayVerses: {
      height: '85%',
    },
    navRow: {
      height: '10%',
    },
    nextBaniBtn: {
      height: '4%',
    },
  });

  function NavRow() {
    return (
      <View style={styles.navRow}>
        <NavigationRow
          setCurrPartitionIdx={setCurrPartitionIdx}
          maxPartition={partitions.length - 1}
          setButtomSheet={setButtomSheet}
          highlightNextBtnOn={highlightNextBtnOn}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {navigationRowOnTop ? <NavRow /> : null}
      <View style={styles.displayVerses}>
        <DisplayVerses
          current_verses={current_verses}
          fontType={fontType}
          fontSize={fontSize}
          gurmukhiOn={gurmukhiOn}
          translationType={translationType}
          larivaarOn={larivaarOn}
          transliterationType={transliterationType}
          visraamType={visraamType}
          setHighlightNextBtn={setHighlightNextBtn}
        />
      </View>
      {navigationRowOnTop ? null : <NavRow />}
      <View style={styles.nextBaniBtn}>
        <NextBaniBtn
          dataObj={dataObj}
          token_index={token_index}
          navigation={navigation}
          darkMode={state.darkMode}
        />
      </View>

      <ButtomSheet
        setButtomSheet={setButtomSheet}
        bottomSheetOpen={bottomSheetOpen}
        fontSize={fontSize}
        setFontSize={setFontSize}
        gurmukhiOn={gurmukhiOn}
        setGurmukhiOn={setGurmukhiOn}
        translationType={translationType}
        setTranslations={setTranslations}
        larivaarOn={larivaarOn}
        setLarivaarOn={setLarivaarOn}
        transliterationType={transliterationType}
        setTransliteration={setTransliteration}
        navigationRowOnTop={navigationRowOnTop}
        setNavigationRow={setNavigationRow}
        visraamType={visraamType}
        setVisraam={setVisraam}
        fontType={fontType}
        setFont={setFont}
      />
    </View>
  );
}

function NextBaniBtn({dataObj, token_index, navigation, darkMode}) {
  const [next_bani_token, nextInd] = incrementKey(dataObj, token_index);
  const bani_data = banis_api_data[next_bani_token];
  const title = bani_data.baniInfo.unicode;
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          padding: 5,
          backgroundColor: allColors[darkMode].headerColor,
          borderRadius: 5,
        }}
        onPress={() => {
          navigation.navigate('OpenTextBanis', {
            bani_token: next_bani_token,
            dataObj,
            token_index: nextInd,
          });
        }}>
        <Text
          style={{
            color: darkMode ? 'white' : 'black',
            fontWeight: '900',
          }}>
          Next Bani: {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function NavigationRow({
  setCurrPartitionIdx,
  maxPartition,
  setButtomSheet,
  highlightNextBtnOn,
}) {
  const state = useSelector(theState => theState.theReducer);
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: '100%',
      alignItems: 'center',
      margin: 5,
      padding: 5,
    },
    btn: {
      margin: 10,
      padding: 5,
      flex: 1,
      backgroundColor: allColors[state.darkMode].headerColor,
      borderRadius: 5,
      borderWidth: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setCurrPartitionIdx(prev => {
            if (0 === prev) return 0;
            return prev - 1;
          });
        }}>
        <Icon
          name="arrow-back-outline"
          type="ionicon"
          color={state.darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => setButtomSheet(true)}>
        <Icon
          name="settings-outline"
          type="ionicon"
          color={state.darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.btn,
          borderColor: highlightNextBtnOn ? 'red' : 'black',
        }}
        onPress={() => {
          setCurrPartitionIdx(prev => {
            if (maxPartition === prev) return prev;
            return prev + 1;
          });
        }}>
        <Icon
          name="arrow-forward-outline"
          size={30}
          type="ionicon"
          color={state.darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
}

function DisplayVerses({
  current_verses,
  fontType,
  fontSize,
  gurmukhiOn,
  translationType,
  transliterationType,
  larivaarOn,
  visraamType,
  setHighlightNextBtn,
}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const baniViewDiv = useRef(null);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      padding: 10,
      margin: 5,
      borderWidth: 1,
      borderColor: darkMode ? 'white' : 'black',
      borderRadius: 5,
    },
  });

  useEffect(() => {
    baniViewDiv.current?.scrollToIndex({index: 0});
  }, [current_verses]);

  const [atEnd, setAtEnd] = useState(false);
  function handleScroll(event) {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isAtEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Check if we're near the end

    if (isAtEnd && !atEnd) {
      setAtEnd(true); // Set to true if the user reaches the end
      setHighlightNextBtn(true);
    } else if (!isAtEnd && atEnd) {
      setAtEnd(false); // Set to false if the user scrolls away from the end
      setHighlightNextBtn(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={baniViewDiv}
        data={current_verses}
        onScroll={handleScroll}
        keyExtractor={item => item.verse.verseId}
        initialNumToRender={30}
        initialScrollIndex={0}
        estimatedItemSize={current_verses.length}
        onEndReached={() => {}}
        renderItem={({item, index}) => (
          <Pantgi
            item={item}
            index={index}
            larivaarOn={larivaarOn}
            translationType={translationType}
            transliterationType={transliterationType}
            gurmukhiOn={gurmukhiOn}
            fontType={fontType}
            current_verses={current_verses}
            fontSize={fontSize}
            darkMode={darkMode}
            visraamType={visraamType}
          />
        )}
      />
    </View>
  );
}

function Pantgi({
  item,
  index,

  larivaarOn,
  translationType,
  transliterationType,
  gurmukhiOn,
  fontType,
  current_verses,
  fontSize,
  darkMode,
  visraamType,
}) {
  // item is object from verses array exp: ../assets/bani_data/aarti.json
  const [isLarivaar, setIsLarivaar] = useState(larivaarOn);
  useEffect(() => {
    setIsLarivaar(larivaarOn);
  }, [larivaarOn]);

  function Spacer() {
    const add_space =
      item.paragraph === current_verses[index + 1]?.paragraph ? false : true;
    if (add_space) {
      return (
        <View>
          {/* <Text>{translationsOn ? '\n' : ''}</Text> */}
          <Text>{false ? '\n' : ''}</Text>
        </View>
      );
    }
  }

  function GurmukhiLine() {
    if (!gurmukhiOn) return <></>;
    // const vis = true;

    const pangti =
      fontType === 'unicode'
        ? item.verse.verse.unicode
        : item.verse.verse.gurmukhi;

    const words = pangti.split(' ');

    const larivaarLine =
      fontType === 'unicode'
        ? pangti.replace(/ /g, '')
        : item.verse.larivaar.gurmukhi;

    const visraams = new Map();
    try {
      item.verse.visraam[visraamType].forEach(obj =>
        visraams.set(obj.p, obj.t),
      );
    } catch (e) {
      // console.log(e);
    }

    return (
      <TouchableOpacity onPress={() => setIsLarivaar(!isLarivaar)}>
        <Text
          style={{
            fontFamily: fontType !== 'unicode' ? fontType : null,
            fontSize: fontSize,
            flexWrap: 'wrap', // ensures that the text wraps within the container
          }}>
          {words.map((word, i) => {
            let wordColor = darkMode ? 'white' : 'black';
            if (visraams.has(i)) {
              const type = visraams.get(i);
              wordColor = type === 'v' ? 'green' : 'orange';
            }
            return (
              <Text key={i} style={{color: wordColor}}>
                {word}
                {!isLarivaar && i < words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
      </TouchableOpacity>
    );
  }

  function TranslationLine() {
    const en = item.verse.translation.en[translationType.en];
    const es = item.verse.translation.es[translationType.es];
    let pu = item.verse.translation.pu[translationType.pu];
    pu = fontType === 'unicode' ? pu?.unicode : pu?.gurmukhi;

    const list = [];
    if (en) {
      list.push(
        <Text style={{color: darkMode ? 'white' : 'black'}}> {en} </Text>,
      );
    }
    if (pu) {
      list.push(
        <Text
          style={{
            color: darkMode ? 'white' : 'black',
            fontFamily: fontType !== 'unicode' ? fontType : null,
          }}>
          {pu}
        </Text>,
      );
    }
    if (es) {
      list.push(
        <Text style={{color: darkMode ? 'white' : 'black'}}> {es} </Text>,
      );
    }
    return list;
  }

  function TransliterationLine() {
    if (item.verse.transliteration[transliterationType]) {
      return (
        <Text style={{color: darkMode ? 'white' : 'black', padding: 3}}>
          {item.verse.transliteration[transliterationType]}
        </Text>
      );
    }
  }

  return (
    <View style={{}}>
      <GurmukhiLine />
      <TranslationLine />
      <TransliterationLine />
      <Spacer />
    </View>
  );
}

function TheSelect({options, setCurrPartitionIdx, currPartitionIdx, darkMode}) {
  const dropdownRef = useRef(null);
  const styles = StyleSheet.create({
    dropdownButtonStyle: {
      // height: 50,
      width: 100,
      margin: 10,
      paddingVertical: 3,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: '#E9ECEF',
      flexDirection: 'row',
      justifyContent: 'center',
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

  useEffect(() => {
    dropdownRef?.current?.selectIndex(currPartitionIdx);
  }, [currPartitionIdx]);

  return (
    <SelectDropdown
      ref={dropdownRef}
      data={options}
      // defaultValueByIndex={currPartitionIdx}
      onSelect={(selectedItem, index) => {
        setCurrPartitionIdx(index);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Icon
              name="add-outline"
              type="ionicon"
              size={15}
              color={!darkMode ? 'white' : 'black'}
            />
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.title) || 'Select your mood'}
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
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={true}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
}

const fonts = [
  'AmrLipiHeavy',
  'unicode',
  'AnmolLipi',
  'Choti Script 7 Bold',
  'GHW Adhiapak Black',
  'GHW Adhiapak Bold',
  'GHW Adhiapak Book',
  'GHW Adhiapak Chisel Blk',
  'GHW Adhiapak Extra Light',
  'GHW Adhiapak Light',
  'GHW Adhiapak Medium',
];
