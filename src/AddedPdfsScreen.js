import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {allColors} from '../assets/styleForEachOption.js';
import {Add_Or_Del_Folder_or_File} from './components/add_or_del_item_Modal.js';
import {useDispatch, useSelector} from 'react-redux';
import PDFsListDisplay from './components/PDFsListDisplay.js';
import {navigatorHearderObj} from './utils.js';

export default function AddedPDFsScreen({route, navigation}) {
  const [visible, setVisibility] = React.useState(false);
  const [typeOfModal, setTypeOfModal] = React.useState('');
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
      backgroundColor: visible
        ? 'rgba(0,0,0,0.5)'
        : allColors[state.darkMode].mainBackgroundColor,
      height: '100%',
    },
    scroll: {
      height: '85%',
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <PDFsListDisplay
          state={state}
          dispatch={dispatch}
          fullPath={route.params.fullPath}
          dataObj={route.params.dataObj}
          navigation={navigation}
        />
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={() => {
            setTypeOfModal('add');
            setVisibility(true);
          }}>
          <Icon
            name={'add-outline'}
            type="ionicon"
            size={50}
            color={state.darkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setTypeOfModal('delete');
            setVisibility(true);
          }}>
          <Icon
            name={'trash-outline'}
            type="ionicon"
            size={50}
            color={state.darkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>
      </View>
      <Add_Or_Del_Folder_or_File
        state={state}
        dispatch={dispatch}
        visible={visible}
        setVisibility={setVisibility}
        fullPath={route.params.fullPath}
        navigation={navigation}
        actionType={typeOfModal}
      />
    </View>
  );
}
