import React, {useRef, useState, useEffect, useCallback} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {bani_partitions} from '../../assets/longData_text.js';
import {banis_api_data} from '../../assets/text_banis_data.js';
import {allColors} from '../../assets/styleForEachOption.js';
import {incrementKey} from '../../assets/helper_funcs.js';

import {setSettingsForTextBani} from '../../redux/actions.js';
import {useSelector, useDispatch} from 'react-redux';

import SelectDropdown from 'react-native-select-dropdown';
import ButtomSheet from './buttomSheetOnTextBani.js';


export default function NavigationRow({
  currPartitionIdx,
  setCurrPartitionIdx,
  maxPartition,
  setBottomSheetOpen,
  dataObj,
  token_index,
  navigation,
  overallProgress,
}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);

  const atEnd = currPartitionIdx === maxPartition;
  const baniInParts = useSelector(
    theState => theState.theReducer.textBaniSettings.baniInParts,
  );

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
      backgroundColor: allColors[darkMode].headerColor,
      borderRadius: 5,
      borderWidth: 0.5,
    },
    disabledBtn: {
      opacity: 0.5,
    },
    nextBtnStyle: {
      color: darkMode ? 'white' : 'black',
      fontWeight: '900',
      flex: 1,
    },
  });

  function NextBtn() {
    return (
      <TouchableOpacity
        style={{...styles.btn, borderColor: 'black'}}
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
          color={darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
    );
  }

  function PrevBtn() {
    return (
      <TouchableOpacity
        style={[styles.btn, currPartitionIdx === 0 && styles.disabledBtn]}
        onPress={() => {
          if (currPartitionIdx !== 0) {
            setCurrPartitionIdx(prev => prev - 1);
          }
        }}
        disabled={currPartitionIdx === 0}>
        <Icon
          name="arrow-back-outline"
          type="ionicon"
          color={darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
    );
  }

  function NextBaniBtn() {
    const [next_bani_token, nextInd] = incrementKey(dataObj, token_index);
    const bani_data = banis_api_data[next_bani_token];
    const title = bani_data.baniInfo.unicode;

    return (
      <TouchableOpacity
        style={{...styles.btn, borderColor: 'black'}}
        onPress={() => {
          Alert.alert('Are you sure you want to go to the next bani?', title, [
            {
              text: 'Cancel',
              onPress: () => {},
            },
            {
              text: 'Yes',
              onPress: () => {
                navigation.replace('OpenTextBanis', {
                  bani_token: next_bani_token,
                  dataObj,
                  token_index: nextInd,
                });
              },
            },
          ]);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.nextBtnStyle}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <PrevBtn />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setBottomSheetOpen(true)}>
        <Icon
          name="settings-outline"
          type="ionicon"
          color={darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
      {atEnd ? <NextBaniBtn /> : <NextBtn />}
    </View>
  );
}
