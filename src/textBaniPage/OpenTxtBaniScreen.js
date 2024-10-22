import React, {useRef, useState, useEffect, useMemo} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';

import {bani_partitions} from '../../assets/longData_text.js';
import {banis_api_data} from '../../assets/text_banis_data.js';
import {allColors} from '../../assets/styleForEachOption.js';

import ButtomSheet from './buttomSheetOnTextBani.js';
import DisplayVerses from './displayVerses.js';
import NavigationRow from './navRow.js';

export default function OpenTxtBaniScreen({navigation, route}) {
  const {bani_token, dataObj, token_index} = route.params;
  const darkMode = useSelector(state => state.theReducer.darkMode);
  const textBaniSettings = useSelector(
    state => state.theReducer.textBaniSettings,
  );

  const [overallProgress, setOverallProgress] = useState(0);
  const [currPartitionIdx, setCurrPartitionIdx] = useState(0);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const partitions = useMemo(() => {
    if (!textBaniSettings.baniInParts || !(bani_token in bani_partitions)) {
      return [0];
    }
    return bani_partitions[bani_token];
  }, [bani_token, textBaniSettings.baniInParts]);

  const bani_data = banis_api_data[bani_token];
  const current_verses = useMemo(() => {
    const filteredVerses = bani_data.verses.filter(
      verse => verse.mangalPosition !== 'above',
    );
    if (currPartitionIdx === partitions.length - 1) {
      return filteredVerses.slice(partitions[currPartitionIdx]);
    } else {
      return filteredVerses.slice(
        partitions[currPartitionIdx],
        partitions[currPartitionIdx + 1],
      );
    }
  }, [bani_data, currPartitionIdx, partitions]);

  useEffect(() => {
    const totalVerses = bani_data.verses.length;
    const currentVerseIndex = partitions[currPartitionIdx];
    const progress = currentVerseIndex / totalVerses;
    setOverallProgress(progress);

    const title = bani_data.baniInfo.unicode;
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
        if (!textBaniSettings.baniInParts) return <></>;
        return (
          <TheSelect
            options={partitions.map((verseIdx, idx) => ({
              title: `${idx + 1}: ${bani_data.verses[verseIdx].verse.verse.unicode}`,
            }))}
            setCurrPartitionIdx={setCurrPartitionIdx}
            currPartitionIdx={currPartitionIdx}
            darkMode={darkMode}
          />
        );
      },
    });
  }, [
    navigation,
    bani_data,
    darkMode,
    currPartitionIdx,
    partitions,
    textBaniSettings.baniInParts,
  ]);

  function NavRow({onTop}) {
    if (onTop === textBaniSettings.navigationRowOnTop)
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
      {textBaniSettings.showProgressBarForWholeBani && (
        <View style={styles.overallProgressBarContainer}>
          <View
            style={[
              styles.overallProgressBar,
              {width: `${overallProgress * 100}%`},
            ]}
          />
        </View>
      )}
      <NavRow onTop={false} />
      <ButtomSheet
        setBottomSheetOpen={setBottomSheetOpen}
        bottomSheetOpen={bottomSheetOpen}
      />
    </View>
  );
}

function TheSelect({ options, setCurrPartitionIdx, currPartitionIdx, darkMode }) {
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
