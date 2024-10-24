import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {allColors} from '../assets/styleForEachOption.js';
import {navigatorHearderObj} from './utils.js';

import {MainBar} from './components/mainBarOpt.js';
import {getItemFromFullPath} from '../assets/helper_funcs.js';
import {setTxtBaniCheckBox, setTextBaniStar} from '../redux/actions.js';

export function TextBanisListScreen({navigation, route}) {
  const dispatch = useDispatch();
  const state = useSelector(theState => theState.theReducer);

  React.useEffect(() => {
    const {title, fullPath, dataObj} = route.params;
    navigation.setOptions(
      navigatorHearderObj(title, navigation, state),
    );
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
      height: '100%',
    },
    listContainer: {
      flex: 2,
      margin: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <TxtBaniListDisplay
          state={state}
          dispatch={dispatch}
          fullPath={route.params.fullPath}
          dataObj={route.params.dataObj}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export function TxtBaniListDisplay({
  state,
  dispatch,
  navigation,
  dataObj,
  fullPath,
}) {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
    },
    scroll: {
      width: '100%',
      height: '100%',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <FlatList
          keyExtractor={item => item}
          data={Object.keys(dataObj)}
          initialNumToRender={30}
          renderItem={({item, index}) => {
            const isFolder = !dataObj[item].ID;
            const isStared = state.staredTextBanis.find(
              element => element.slice(-1)[0] === item,
            );
            return (
              <MainBar
                state={state}
                isFolder={isFolder}
                text={isFolder ? item : dataObj[item].gurmukhiUni}
                onClick={() => {
                  if (isFolder) {
                    let theDataObj = getItemFromFullPath(
                      state.allTextBanis,
                      fullPath,
                    )[item];

                    navigation.push('TextBanisListScreen', {
                      dataObj: theDataObj,
                      title: item,
                      fullPath: [...fullPath, item],
                    });
                  } else {
                    // console.log(item, fullPath);
                    navigation.navigate('OpenTextBanis', {
                      bani_token: item,
                      dataObj,
                      token_index:index,
                    });
                  }
                }}
                onCheckBoxClick={() =>
                  dispatch(setTxtBaniCheckBox(item, fullPath))
                }
                checked={
                  getItemFromFullPath(state.allTextBanis, fullPath)[item]
                    .checked
                }
                isStared={isStared}
                onStarClick={() => dispatch(setTextBaniStar(item, fullPath))}
              />
            );
          }}
        />
      </View>
    </View>
  );
}
