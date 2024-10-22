import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  setTheState,
  correctPDFstate,
  addToShabadHistory,
  togglePDFVersionList,
  setTextBaniStar,
  setPDFStar,
  setTxtBaniCheckBox,
  setCheckBox,
} from '../redux/actions.js';
import {initialState} from '../redux/reducers.js';
import {allColors} from '../assets/styleForEachOption.js';
import {getRandomShabadId} from './shabadPage/shabadPage.js';
import {navigatorHearderObj} from './utils.js';
import PDFsListDisplay from './components/PDFsListDisplay.js';
import {folderToFileDataPDFs} from '../assets/longData_pdf.js';
import {bani_display_order} from '../assets/longData_text.js';
import {TxtBaniListDisplay} from './TextBanisListScreen.js';
import {getItemFromFullPath, haveSameKeys} from '../assets/helper_funcs.js';
import {MainBar} from './components/mainBarOpt.js';

import {Switch, Icon} from 'react-native-elements';

function HomeScreen({navigation, route}) {
  const dispatch = useDispatch();
  let state = useSelector(theState => theState.theReducer);

  React.useEffect(() => {
    async function getData() {
      try {
        const theStringState = await AsyncStorage.getItem('state');
        let theState;
        if (theStringState) {
          theState = JSON.parse(theStringState);
          if (haveSameKeys(initialState, theState) === false) {
            theState = initialState;
            console.log(
              'Inital State had diffrent number of keys than saved state',
            );
          } else {
            console.log('state was found and loaded');
          }
        } else {
          console.log('there is nothing is state');
          theState = initialState;
        }
        state = theState;
        dispatch(setTheState(theState));
        dispatch(correctPDFstate());
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }
    getData();
  }, []);

  React.useEffect(() => {
    navigation.setOptions(
      navigatorHearderObj(
        'Santhiya Pothi',
        navigation,
        state,
      ),
    );
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
      height: '100%',
    },
    mainListContainer: {
      margin: 5,
      height: '60%',
    },
    staredList: {
      margin: 1,
      padding: 5,
      height: '25%',
    },
    bottomList: {
      margin: 5,
      height: '10%',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainListContainer}>
        {state['pdfVersionList'] ? (
          <PDFsListDisplay
            state={state}
            dispatch={dispatch}
            fullPath={[]}
            dataObj={folderToFileDataPDFs}
            navigation={navigation}
          />
        ) : (
          <TxtBaniListDisplay
            state={state}
            dispatch={dispatch}
            fullPath={[]}
            dataObj={bani_display_order}
            navigation={navigation}
          />
        )}
      </View>
      <View style={styles.staredList}>
        <StaredItems
          state={state}
          dispatch={dispatch}
          navigation={navigation}
        />
      </View>
      <View style={styles.bottomList}>
        <MainScreenButtom
          state={state}
          dispatch={dispatch}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

function StaredItems({state, dispatch, navigation}) {
  const staredStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      height: '100%',
    },
    title: {
      color: state.darkMode ? 'white' : 'black',
      alignSelf: 'flex-start',
      fontWeight: 'bold', // This makes the text bold
    },
    scroll: {
      width: '100%',
      height: '100%',
    },
  });

  const isPdfList = state.pdfVersionList;
  const list = isPdfList ? state.staredPdfs : state.staredTextBanis;

  return (
    <View style={staredStyles.container}>
      <Text style={staredStyles.title}>Stared Items: {list.length}</Text>
      <View style={staredStyles.scroll}>
        <FlatList
          keyExtractor={item => item} //name of each item like 'Bai Vaara'
          data={list}
          initialNumToRender={30}
          renderItem={({item}) => {
            const fullObj = isPdfList ? state.allPdfs : state.allTextBanis;
            const baniObj = getItemFromFullPath(fullObj, item);
            const bani_name = item[item.length - 1];
            const title = isPdfList ? bani_name : baniObj.gurmukhiUni;
            const path_before_bani = item.slice(0, -1);

            function onBarClick() {
              if (isPdfList) {
                console.log(bani_name,item)
                navigation.navigate('OpenPdf', {
                  pdfTitle: bani_name,
                  fullPath: [...path_before_bani],
                });
              } else {
                navigation.navigate('OpenTextBanis', {
                  bani_token: bani_name,
                });
              }
            }

            function onCheckBoxClick() {
              if (isPdfList) {
                dispatch(setCheckBox(bani_name, path_before_bani));
              } else {
                dispatch(setTxtBaniCheckBox(bani_name, path_before_bani));
              }
            }

            function onStarClick() {
              if (isPdfList) {
                dispatch(setPDFStar(bani_name, path_before_bani));
              } else {
                dispatch(setTextBaniStar(bani_name, path_before_bani));
              }
            }

            return (
              <MainBar
                state={state}
                isFolder={false}
                text={title}
                onClick={onBarClick}
                onCheckBoxClick={onCheckBoxClick}
                checked={baniObj.checked}
                isStared={true}
                onStarClick={onStarClick}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

function MainScreenButtom({state, dispatch, navigation}) {
  const buttomStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      margin: 5,
    },
    pdfBtn: {
      flex: 1,
      backgroundColor: allColors[state.darkMode].shabadPage.openShabadBtn,
      margin: 5,
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
    openShabadBtn: {
      flex: 1,
      margin: 5,
      backgroundColor: allColors[state.darkMode].shabadPage.openShabadBtn,
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
  });

  const pdfList = state['pdfVersionList'];
  return (
    <View style={buttomStyles.container}>
      <TouchableOpacity
        style={buttomStyles.pdfBtn}
        onPress={() => dispatch(togglePDFVersionList(!pdfList))}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <Icon
              name={pdfList ? 'image-outline' : 'document-text-outline'}
              type="ionicon"
              color={state.darkMode ? 'white' : 'black'}
            />
          </View>
          <View style={{flex: 1}}>
            <Switch
              value={pdfList}
              onValueChange={val => dispatch(togglePDFVersionList(val))}
            />
          </View>
        </View>
        <Text style={{color: state.darkMode ? 'white' : 'black'}}>
          Toggle: {pdfList ? 'PDFs' : 'Text Banis'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={buttomStyles.openShabadBtn}
        onPress={() => {
          const theID = getRandomShabadId();
          const theObj = {shabadId: theID, saved: false};
          navigation.navigate('ReadShabad', {
            shabadData: theObj,
            index: state.shabadHistory.length,
            type: 'shabad',
          });
          dispatch(addToShabadHistory(theObj));
        }}>
        <Icon
          name="shuffle-outline"
          type="ionicon"
          color={state.darkMode ? 'white' : 'black'}
        />
        <Text style={{color: state.darkMode ? 'white' : 'black'}}>
          Open Random Shabad
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
