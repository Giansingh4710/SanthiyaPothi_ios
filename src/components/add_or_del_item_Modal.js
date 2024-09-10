import React from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';
import {Icon} from 'react-native-elements';
import {allColors} from '../../assets/styleForEachOption.js';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import {BarOption} from './baroption.js';

import {addPDForFolder, deletePDForFolder} from '../../redux/actions.js';

export function Add_Or_Del_Folder_or_File({
  state,
  dispatch,
  visible,
  setVisibility,
  fullPath,
  navigation,
  actionType,
}) {
  if (actionType === 'add')
    return (
      <AddItemModal
        state={state}
        dispatch={dispatch}
        visible={visible}
        setVisibility={setVisibility}
        fullPath={fullPath}
        navigation={navigation}
      />
    );
  else if (actionType === 'delete')
    return (
      <DeleteItemsModal
        state={state}
        dispatch={dispatch}
        visible={visible}
        setVisibility={setVisibility}
        fullPath={fullPath}
        navigation={navigation}
      />
    );
  return <></>;
}

function DeleteItemsModal({
  state,
  dispatch,
  visible,
  setVisibility,
  fullPath,
  navigation,
}) {
  const dataObj = getItemFromFullPath(state.allPdfs, fullPath);
  const files = Object.keys(dataObj);
  const [checksLst, setChecksLst] = React.useState(files.map(() => false));
  const deleteFilesAlert = () => {
    const msg = 'Are you sure you want the delete the selected files?';
    return Alert.alert('This Action is Irreversible', msg, [
      {
        text: 'Yes',
        onPress: () => {
          for (const ind in files) {
            const fileName = files[ind];
            if (checksLst[ind]) dispatch(deletePDForFolder(fileName, fullPath));
          }
          navigation.goBack();
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  };
  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].headerColor,
      top: '5%',
      height: '70%',
      width: '90%',
      left: '5%',
      borderRadius: 40,
      // justifyContent: 'center',
      // alignItems: 'center',
      // position: 'absolute',
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      margin: 10,
    },
    title: {
      flex: 3,
      margin: 10,
      fontSize: 18,
      color: state.darkMode ? 'white' : 'black',
    },
    text: {
      color: state.darkMode ? 'white' : 'black',
      fontSize: 16,
      // justifyContent:'flex-start'
    },
    icons: {
      flex: 1,
    },
    textInput: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 5,
    },
    ButtomButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
    },
  });
  return (
    <Modal
      visible={visible}
      // transparent
      animationType="slide"
      onRequestClose={() => {
        setVisibility(false);
      }}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.icons}
            onPress={() => {
              setVisibility(false);
            }}>
            <Icon
              name="arrow-back-outline"
              type="ionicon"
              size={50}
              color={state.darkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            Select the Items you want to Delete :
          </Text>
        </View>
        <FlatList
          keyExtractor={item => item} //name of each item like 'Bai Vaara'
          data={files}
          renderItem={({item, index}) => {
            const isFolder = !dataObj[item].currentAng; //currentAng will never be 0
            return (
              <BarOption
                state={state}
                height={95}
                left={
                  <Icon
                    name={isFolder ? 'folder-outline' : 'document-outline'}
                    type="ionicon"
                    color={state.darkMode ? 'white' : 'black'}
                  />
                }
                text={item}
                right={
                  <CheckBox
                    value={checksLst[index]}
                    onValueChange={newValue =>
                      setChecksLst(oldLst => {
                        oldLst[index] = newValue;
                        return [...oldLst];
                      })
                    }
                  />
                }
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
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.ButtomButton}
            onPress={() => {
              // setVisibility(false);
              deleteFilesAlert();
            }}>
            <Icon
              name="trash-outline"
              type="ionicon"
              color={state.darkMode ? 'white' : 'black'}
            />
            <Text style={styles.text}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function AddItemModal({
  state,
  dispatch,
  visible,
  setVisibility,
  fullPath,
  navigation,
}) {
  const sameFileAlert = () => {
    const msg = 'No folder name given. Please Enter a folder name.';
    return Alert.alert('Folder Name left Blank!!!', msg, [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };

  async function pickDoc() {
    try {
      const res = await DocumentPicker.pick({
        type: DocumentPicker.types.pdf,
        allowMultiSelection: true,
        copyTo: 'cachesDirectory',
      });
      // console.log(res)
      navigation.goBack();
      res.map((file, index) => {
        const name = file.name;
        const details = {
          checked: false,
          currentAng: 1,
          uri: file.fileCopyUri,
        };
        dispatch(addPDForFolder(name, details, fullPath));
      });
    } catch (err) {
      // alert(err);
      console.log(err);
    }
    setVisibility(false);
  }

  const styles = commoncss(state);
  return (
    <Modal
      visible={visible}
      // transparent
      animationType="slide"
      onRequestClose={() => {
        setVisibility(false);
      }}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.icons}
            onPress={() => {
              setVisibility(false);
            }}>
            <Icon
              name="arrow-back-outline"
              type="ionicon"
              size={50}
              color={state.darkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Add a File or Folder :</Text>
        </View>

        <View style={styles.topRow}>
          <Text style={styles.text}>Add a Folder : </Text>
          <TextInput
            style={styles.textInput}
            placeholder="exp: Folder 1"
            onSubmitEditing={e => {
              const folderName = e.nativeEvent.text;
              if (folderName === '') {
                sameFileAlert();
                return;
              }
              dispatch(addPDForFolder(folderName, {}, fullPath));
              navigation.goBack();
              setVisibility(false);
            }}
          />
        </View>

        <View style={styles.topRow}>
          <Text style={styles.text}>Add a File : </Text>
          <TouchableOpacity
            style={styles.ButtomButton}
            onPress={() => {
              pickDoc();
            }}>
            <Text style={styles.text}>Pick File</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          style={styles.ButtomButton}
          onPress={() => {
            setVisibility(false);
          }}>
          <Text style={styles.text}>Go Back</Text>
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
}

export function PdfInfoModal({
  visible,
  setHeaderShown,
  setVisibility,
  state,
  pdfInfo,
}) {
  const styles = commoncss(state);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        setVisibility(false);
        setHeaderShown(true);
      }}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.icons}
            onPress={() => {
              setVisibility(false);
              setHeaderShown(true);
            }}>
            <Icon
              name="arrow-back-outline"
              type="ionicon"
              size={50}
              color={state.darkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
          <Text style={styles.title}>PDF Info :</Text>
        </View>
        <View style={styles.topRow}>
          <Text style={styles.text}>Title : </Text>
          <Text style={styles.text}>{pdfInfo.pdfTitle}</Text>
        </View>
        <View style={styles.topRow}>
          <Text style={styles.text}>Checked : </Text>
          <Text style={styles.text}>{pdfInfo.checked ? 'True' : 'False'}</Text>
        </View>
        <View style={styles.topRow}>
          <Text style={styles.text}>Current Saved Page : </Text>
          <Text style={styles.text}>{pdfInfo.currentAng}*</Text>
        </View>
        <View style={styles.topRow}>
          <Text style={styles.text}>Uri : </Text>
          <Text style={styles.text}>{pdfInfo.uri}</Text>
        </View>
        <Text style={styles.text}>
          *(the Current Saved Page is changed when you leave the pdf screen and
          not when you change pages in the pdf)
        </Text>
      </View>
    </Modal>
  );
}

function commoncss(state) {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: allColors[state.darkMode].headerColor,
      // backgroundColor: 'blue',
      // height: '50%',
      // backgroundColor: 'rgba(0,0,0,0.5)',
      // height:'100%',
      top: '25%',
      // bottom: '50%',
      width: '90%',
      left: '5%',
      borderRadius: 25,
      // position: 'absolute',
    },
    topRow: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
      margin: 10,
      flexWrap: 'wrap',
      // padding:2,
    },
    title: {
      flex: 3,
      margin: 10,
      fontSize: 18,
      color: state.darkMode ? 'white' : 'black',
    },
    text: {
      color: state.darkMode ? 'white' : 'black',
      fontSize: 16,
      overflow: 'scroll',
      // justifyContent:'flex-start'
    },
    icons: {
      flex: 1,
    },
    textInput: {
      backgroundColor: 'white',
      borderRadius: 5,
    },
    ButtomButton: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
    },
  });
  return styles;
}
