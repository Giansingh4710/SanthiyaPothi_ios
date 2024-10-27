import React, {useRef, useState, useEffect, useMemo} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';

import {banis_api_data} from '../../assets/text_banis_data.js';
import {allColors} from '../../assets/styleForEachOption.js';
import {cacheBani} from '../../redux/actions.js';

import BottomSheet from './BottomSheet.js';
import DisplayVerses from './DisplayVerses.js';
import NavigationRow from './NavRow.js';

export default function OpenTxtBaniScreen({navigation, route}) {
  const {bani_token, dataObj, token_index} = route.params;
  const darkMode = useSelector(state => state.theReducer.darkMode);
  const text_bani = useSelector(state => state.theReducer.text_bani);
  const allBanis = useSelector(state => state.theReducer.text_bani.allTextBanis['All Banis']);
  const cacheType = useSelector(state => state.theReducer.cacheType);
  const cachedBanis = useSelector(state => state.theReducer.text_bani.cachedBanis);
  const dispatch = useDispatch();

  // const bani_lines = banis_api_data[bani_token].verses;
  // const [bani_lines, setBani_lines] = useState(banis_api_data[bani_token].verses);

  const [overallProgress, setOverallProgress] = useState(0);
  const [currPartitionIdx, setCurrPartitionIdx] = useState(0);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bani_lines, setBani_lines] = useState([]);
  const bani_obj = allBanis[bani_token]; //{"ID": 87, "gurmukhi": "vwr mwJ kI", "gurmukhiUni": "ਵਾਰ ਮਾਝ ਕੀ", "transliteration": "vaar maajh kee", "url": "https://api.banidb.com/v2/banis/87"}

  useEffect(() => {
    let linesSet = false;
    if (bani_token in cachedBanis) {
      linesSet = true;
      setBani_lines(cachedBanis[bani_token]);
    }

    fetch(bani_obj.url)
      .then(res => res.json())
      .then(data => {
        if (!linesSet) setBani_lines(data.verses);
        dispatch(cacheBani(bani_token, data.verses));
      })
      .catch(err => {
        Alert.alert(err.message);
      });
  }, []);

  const partitions = useMemo(() => {
    if (!text_bani.baniInParts || !(bani_token in text_bani.bani_partitions)) {
      return [0];
    }
    return text_bani.bani_partitions[bani_token];
  }, [bani_token, text_bani.baniInParts, text_bani.bani_partitions]);

  const current_verses = useMemo(() => {
    const filteredVerses = bani_lines.filter(verse => verse.mangalPosition !== 'above');
    if (currPartitionIdx === partitions.length - 1) {
      return filteredVerses.slice(partitions[currPartitionIdx]);
    } else {
      return filteredVerses.slice(partitions[currPartitionIdx], partitions[currPartitionIdx + 1]);
    }
  }, [bani_lines, currPartitionIdx, partitions]);

  useEffect(() => {
    const totalVerses = bani_lines.length;
    const currentVerseIndex = partitions[currPartitionIdx];
    const progress = currentVerseIndex / totalVerses;
    setOverallProgress(progress);

    const title = bani_obj.gurmukhiUni;
    const showTitle = title.length > 15 ? title.slice(0, 15) + '...' : title;
    navigation.setOptions({
      title: showTitle,
      headerStyle: {
        backgroundColor: allColors[darkMode].headerColor,
      },
      headerTintColor: darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: darkMode ? 'white' : 'black',
      },
      headerRight: () => {
        if (!text_bani.baniInParts || bani_lines.length === 0) return <></>;
        return (
          <TheSelect
            options={partitions.map((verseIdx, idx) => ({
              title: `${idx + 1}: ${bani_lines[verseIdx].verse.verse.unicode}`,
            }))}
            setCurrPartitionIdx={setCurrPartitionIdx}
            currPartitionIdx={currPartitionIdx}
            darkMode={darkMode}
          />
        );
      },
    });
  }, [navigation, bani_lines, darkMode, currPartitionIdx, partitions, text_bani.baniInParts]);

  function NavRow({onTop}) {
    if (onTop === text_bani.navigationRowOnTop)
      return (
        <View style={styles.navRow}>
          <NavigationRow
            currPartitionIdx={currPartitionIdx}
            setCurrPartitionIdx={setCurrPartitionIdx}
            maxPartition={partitions.length - 1}
            setBottomSheetOpen={setBottomSheetOpen}
            dataObj={dataObj}
            token_index={token_index}
            navigation={navigation}
            overallProgress={overallProgress}
          />
        </View>
      );
    return <></>;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[darkMode].mainBackgroundColor,
      height: '100%',
    },
    displayVerses: {
      height: '89%',
    },
    navRow: {
      // height: '10%',
      height: '9%',
    },
    overallProgressBarContainer: {
      height: '0.5%',
      backgroundColor: darkMode ? '#555' : '#c0c0c0',
      borderRadius: 2,
      marginHorizontal: 10,
      marginBottom: 5,
    },
    overallProgressBar: {
      height: '100%',
      backgroundColor: darkMode ? '#ff9800' : '#ff5722',
      borderRadius: 2,
    },
  });

  return (
    <View style={styles.container}>
      <NavRow onTop={true} />
      <View style={styles.displayVerses}>
        <DisplayVerses current_verses={current_verses} />
      </View>
      {text_bani.showProgressBarForWholeBani && (
        <View style={styles.overallProgressBarContainer}>
          <View style={[styles.overallProgressBar, {width: `${overallProgress * 100}%`}]} />
        </View>
      )}
      <NavRow onTop={false} />
      <BottomSheet setBottomSheetOpen={setBottomSheetOpen} bottomSheetOpen={bottomSheetOpen} />
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
            <Icon name="add-outline" type="ionicon" size={15} color={!darkMode ? 'white' : 'black'} />
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
