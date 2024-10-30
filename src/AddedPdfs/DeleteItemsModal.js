import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {Text, StyleSheet, TouchableOpacity, View, Modal, Alert} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import {Icon} from 'react-native-elements';
import {allColors} from '../../assets/styleForEachOption.js';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import {BarOption} from '../components/baroption.js';
import {deletePDForFolder} from '../../redux/actions.js';

import {useDispatch, useSelector} from 'react-redux';

export default function DeleteItemsModal({visible, setVisibility, fullPath}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const allPdfs = useSelector(theState => theState.theReducer.pdf.allPdfs);
  const dispatch = useDispatch();

  const dataObj = getItemFromFullPath(allPdfs, fullPath);

  const files = Object.keys(dataObj);
  const [checksLst, setChecksLst] = React.useState(files.map(() => false));

  const deleteFilesAlert = () => {
    const msg = 'Are you sure you want to delete the selected files?';
    return Alert.alert('This Action is Irreversible', msg, [
      {
        text: 'Yes',
        onPress: () => {
          for (const ind in files) {
            const fileName = files[ind];
            if (checksLst[ind]) dispatch(deletePDForFolder(fileName, fullPath));
          }
          setVisibility(false);
          setChecksLst(files.map(() => false));
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  };
  const styles = theStyles(darkMode);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisibility(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisibility(false)}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Delete Items</Text>
              <TouchableOpacity onPress={() => setVisibility(false)}>
                <Icon name="close" type="ionicon" size={24} color={darkMode ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.numberOfItems}>Number of Items: {files.length}</Text>
            <View style={styles.scroll}>
              <FlashList
                keyExtractor={item => item}
                data={files}
                estimatedItemSize={files.length}
                renderItem={({item, index}) => {
                  const isFolder = !dataObj[item].currentAng;
                  return (
                    <BarOption
                      darkMode={darkMode}
                      left={
                        <Icon
                          name={isFolder ? 'folder-outline' : 'document-outline'}
                          type="ionicon"
                          color={darkMode ? 'white' : 'black'}
                        />
                      }
                      text={item}
                      // right={ <CheckBox value={checksLst[index]} onValueChange={newValue => setChecksLst(oldLst => { oldLst[index] = newValue; return [...oldLst]; }) } /> }
                      onClick={() => {
                        const oldCheckVal = checksLst[index];
                        setChecksLst(oldLst => {
                          oldLst[index] = !oldCheckVal;
                          return [...oldLst];
                        });
                      }}
                    />
                  );
                }}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={deleteFilesAlert}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function theStyles(darkMode) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: allColors[darkMode].headerColor,
      width: '90%',
      height: '50%',
      borderRadius: 20,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      color: darkMode ? 'white' : 'black',
      fontWeight: 'bold',
    },
    numberOfItems:{
      fontSize: 14,
      color: darkMode ? 'white' : 'black',
    },
    scroll: {
      marginBottom: 20,
      width: '100%',
      height: '70%',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    button: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      backgroundColor: allColors[darkMode].mainBackgroundColor,
      marginLeft: 10,
    },
    buttonText: {
      color: darkMode ? 'white' : 'black',
    },
  });
}
