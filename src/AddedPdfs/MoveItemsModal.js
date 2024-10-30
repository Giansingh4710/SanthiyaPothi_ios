import React, {useState} from 'react';
import {FlatList, Text, StyleSheet, TouchableOpacity, View, Modal, Alert} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import {Icon} from 'react-native-elements';
import {allColors} from '../../assets/styleForEachOption.js';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import {BarOption} from '../components/baroption.js';
import {movePDForFolders} from '../../redux/actions.js';

import {useDispatch, useSelector} from 'react-redux';

export default function MoveItemsModal({visible, setVisibility, fullPath}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const allPdfs = useSelector(theState => theState.theReducer.pdf.allPdfs);
  const dispatch = useDispatch();
  const [checkedFolder, setCheckedFolder] = useState('');
  const [showMoveToModal, setShowMoveToModal] = useState(false);

  const dataObj = getItemFromFullPath(allPdfs, fullPath);

  const files = Object.keys(dataObj);
  const folders = files.filter(key => !dataObj[key].currentAng);
  const [checksLst, setChecksLst] = useState(files.map(() => false));
  const styles = theStyles(darkMode);

  function moveToFolder() {
    if (checkedFolder === '') {
      Alert.alert('Please select a folder');
      return false;
    }
    const filesToMove = files.filter((item, index) => checksLst[index]);
    if (filesToMove.some(item => item === checkedFolder)) {
      Alert.alert('Cannot move files to itself: ', checkedFolder);
      return false;
    }
    const fullPathToMove = filesToMove.map(item => [...fullPath, item]);
    const moveToPath = [...fullPath, checkedFolder];
    dispatch(movePDForFolders(fullPathToMove, moveToPath));

    setChecksLst(files.map(() => false));
    setVisibility(false);
    setCheckedFolder('');
    return true;
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisibility(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisibility(false)}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Move Items</Text>
              <TouchableOpacity onPress={() => setVisibility(false)}>
                <Icon name="close" type="ionicon" size={24} color={darkMode ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.numberOfItems}>Number of Items: {files.length}</Text>
            <View style={styles.scroll}>
              <FlatList
                keyExtractor={item => item}
                data={files} // had to use FlatList instead of FlashList here because in FlashList, cant have an empty list
                renderItem={({item, index}) => {
                  const isFolder = !dataObj[item].currentAng;
                  return (
                    <BarOption
                      darkMode={darkMode}
                      // height={95}
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (checksLst.some(value => value === true)) {
                    setShowMoveToModal(true);
                    return;
                  }
                  Alert.alert('Please select at least one item');
                }}>
                <Text style={styles.buttonText}>Move Selected Items</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <MoveItemsToModal
        visible={showMoveToModal}
        setVisibility={setShowMoveToModal}
        folders={folders}
        checkedFolder={checkedFolder}
        setCheckedFolder={setCheckedFolder}
        moveToFolder={moveToFolder}
      />
    </Modal>
  );
}

function MoveItemsToModal({visible, setVisibility, folders, checkedFolder, setCheckedFolder, moveToFolder}) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const styles = theStyles(darkMode);
  function handleClick(item) {
    if (item === checkedFolder) {
      setCheckedFolder('');
    } else {
      setCheckedFolder(item);
    }
  }
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisibility(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisibility(false)}>
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.header}>
              <Text style={styles.title}>Move To</Text>
              <TouchableOpacity onPress={() => setVisibility(false)}>
                <Icon name="close" type="ionicon" size={24} color={darkMode ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.numberOfItems}>Number of Items: {folders.length}</Text>
            <View style={styles.scroll}>
              <FlatList
                keyExtractor={item => item}
                data={folders}
                estimatedItemSize={folders.length}
                renderItem={({item, index}) => {
                  return (
                    <BarOption
                      darkMode={darkMode}
                      left={<Icon name="folder-outline" type="ionicon" color={darkMode ? 'white' : 'black'} />}
                      text={item}
                      // right={<CheckBox value={checkedFolder === item} onValueChange={() => handleClick(item)} />}
                      onClick={() => handleClick(item)}
                    />
                  );
                }}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (moveToFolder()) {
                    setVisibility(false);
                  }
                }}>
                <Text style={styles.buttonText}>To</Text>
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
    numberOfItems: {
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
