import React, {useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import {SafeAreaView, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addToShabadHistory, togglePDFVersionList} from '../redux/actions.js';
import {allColors} from '../assets/styleForEachOption.js';
import {getRandomShabadId} from './randomShabad/shabadPage.js';
import {navigatorHearderObj} from './utils.js';
import PDFsListDisplay from './listPdf/PDFsListDisplay.js';
import PdfBar from './listPdf/PdfBar.js';
import TxtBaniListDisplay from './listTextBani/TxtBaniListDisplay.js';
import TxtBaniBar from './listTextBani/TxtBaniBar.js';
import {getItemFromFullPath} from '../assets/helper_funcs.js';
import {useInitializeData} from './hooks.js';

import {Switch, Icon} from 'react-native-elements';

function HomeScreen({navigation, route}) {
  const allPdfs = useSelector(theState => theState.theReducer.pdf.allPdfs);
  const allTextBanis = useSelector(theState => theState.theReducer.text_bani.allTextBanis);
  const isPdfList = useSelector(theState => theState.theReducer.isPdfList);
  const darkMode = useSelector(theState => theState.theReducer.darkMode);

  useInitializeData();

  useEffect(() => {
    navigation.setOptions(navigatorHearderObj('Santhiya Pothi', navigation, darkMode));
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[darkMode].mainBackgroundColor,
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
        {isPdfList ? (
          <PDFsListDisplay fullPath={[]} dataObj={allPdfs} navigation={navigation} />
        ) : (
          <TxtBaniListDisplay fullPath={[]} dataObj={allTextBanis} navigation={navigation} />
        )}
      </View>
      <View style={styles.staredList}>
        <StaredItems navigation={navigation} />
      </View>
      <View style={styles.bottomList}>
        <MainScreenButtom navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

function StaredItems({navigation}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const {allStaredItems, fullObj, isPdfList} = useSelector(theState => {
    if (theState.theReducer.isPdfList) {
      return {
        allStaredItems: theState.theReducer.pdf.staredPdfs,
        fullObj: theState.theReducer.pdf.allPdfs,
        isPdfList: theState.theReducer.isPdfList,
      };
    }
    return {
      allStaredItems: theState.theReducer.text_bani.staredTextBanis,
      fullObj: theState.theReducer.text_bani.allTextBanis,
      isPdfList: theState.theReducer.isPdfList,
    };
  });
  const list = Object.values(allStaredItems).filter(item => item.on);

  const staredStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      height: '100%',
    },
    title: {
      color: darkMode ? 'white' : 'black',
      alignSelf: 'flex-start',
      fontWeight: 'bold', // This makes the text bold
    },
    scroll: {
      width: '100%',
      height: '100%',
    },
  });

  return (
    <View style={staredStyles.container}>
      <Text style={staredStyles.title}>Stared Items: {list.length}</Text>
      <View style={staredStyles.scroll}>
        {list.length === 0 ? null : (
          <FlashList
            keyExtractor={item => item.fullPath[item.fullPath.length - 1]} //name of each item like 'Sukhmani Sahib'
            data={list}
            initialNumToRender={30}
            estimatedItemSize={list.length}
            renderItem={({item}) => {
              const path_before_bani = item.fullPath.slice(0, -1);
              const bani_name = item.fullPath[item.fullPath.length - 1];
              if (isPdfList) {
                return <PdfBar bani_name={bani_name} fullPath={path_before_bani} navigation={navigation} />;
              }

              const baniObj = getItemFromFullPath(fullObj, item.fullPath);
              return (
                <TxtBaniBar
                  bani_name={bani_name}
                  baniObj={baniObj}
                  fullPath={path_before_bani}
                  navigation={navigation}
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

function MainScreenButtom({navigation}) {
  const dispatch = useDispatch();
  const state = useSelector(theState => theState.theReducer);
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const pdfList = useSelector(theState => theState.theReducer.isPdfList);

  const buttomStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      margin: 5,
    },
    pdfBtn: {
      flex: 1,
      backgroundColor: allColors[darkMode].shabadPage.openShabadBtn,
      margin: 5,
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
    openShabadBtn: {
      flex: 1,
      margin: 5,
      backgroundColor: allColors[darkMode].shabadPage.openShabadBtn,
      alignItems: 'center',
      padding: 5,
      borderRadius: 5,
    },
  });

  return (
    <View style={buttomStyles.container}>
      <TouchableOpacity style={buttomStyles.pdfBtn} onPress={() => dispatch(togglePDFVersionList(!pdfList))}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <Icon
              name={pdfList ? 'image-outline' : 'document-text-outline'}
              type="ionicon"
              color={darkMode ? 'white' : 'black'}
            />
          </View>
          <View style={{flex: 1}}>
            <Switch value={pdfList} onValueChange={val => dispatch(togglePDFVersionList(val))} />
          </View>
        </View>
        <Text style={{color: darkMode ? 'white' : 'black'}}>Toggle: {pdfList ? 'PDFs' : 'Text Banis'}</Text>
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
        <Icon name="shuffle-outline" type="ionicon" color={darkMode ? 'white' : 'black'} />
        <Text style={{color: darkMode ? 'white' : 'black'}}>Open Random Shabad</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
