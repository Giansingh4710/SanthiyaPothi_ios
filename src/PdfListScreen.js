import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {allColors} from '../assets/styleForEachOption.js';
import {navigatorHearderObj} from './utils.js';
import PDFsListDisplay from './components/PDFsListDisplay.js';

function PdfListScreen({navigation, route}) {
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
        <PDFsListDisplay
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

export default PdfListScreen;
