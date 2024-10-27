import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {allColors} from '../../assets/styleForEachOption.js';
import PDFsListDisplay from '../listPdf/PDFsListDisplay.js';
import {navigatorHearderObj} from '../utils.js';

import { useSelector} from 'react-redux';
import AddItemModal from './AddItemModal.js';
import MoveItemsModal from './MoveItemsModal.js';
import DeleteItemsModal from './DeleteItemsModal.js';

export default function AddedPDFsScreen({route, navigation}) {
  const [addItemModalVisible, setAddItemModalVisible] = React.useState(false);
  const [moveItemModalVisible, setMoveItemModalVisible] = React.useState(false);
  const [delItemModalVisible, setDelItemModalVisible] = React.useState(false);
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
        <PDFsListDisplay fullPath={route.params.fullPath} dataObj={route.params.dataObj} navigation={navigation} />
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={() => {
            setAddItemModalVisible(true);
          }}>
          <Icon name={'add-outline'} type="ionicon" size={50} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setMoveItemModalVisible(true);
          }}>
          <Icon name={'folder-open-outline'} type="ionicon" size={50} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDelItemModalVisible(true);
          }}>
          <Icon name={'trash-outline'} type="ionicon" size={50} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
      <>
        <AddItemModal
          visible={addItemModalVisible}
          setVisibility={setAddItemModalVisible}
          fullPath={route.params.fullPath}
        />
        <MoveItemsModal visible={moveItemModalVisible} setVisibility={setMoveItemModalVisible} fullPath={route.params.fullPath} />
        <DeleteItemsModal
          visible={delItemModalVisible}
          setVisibility={setDelItemModalVisible}
          fullPath={route.params.fullPath}
        />
      </>
    </View>
  );
}
