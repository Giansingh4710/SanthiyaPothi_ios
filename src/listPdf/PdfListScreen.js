import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {allColors} from '../../assets/styleForEachOption.js';
import {navigatorHearderObj} from '../utils.js';
import PDFsListDisplay from './PDFsListDisplay.js';

export default function PdfListScreen({navigation, route}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);

  React.useEffect(() => {
    const {title, fullPath, dataObj} = route.params;
    navigation.setOptions(navigatorHearderObj(title, navigation, darkMode));
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[darkMode].mainBackgroundColor,
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
        <PDFsListDisplay fullPath={route.params.fullPath} dataObj={route.params.dataObj} navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}
