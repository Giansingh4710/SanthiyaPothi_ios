import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-elements';
import { allColors } from '../../assets/styleForEachOption.js';
import { useDispatch, useSelector } from 'react-redux';
import { addPDForFolder } from '../../redux/actions.js';

export default function AddItemModal({ visible, setVisibility, fullPath }) {
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const dispatch = useDispatch();
  const [folderName, setFolderName] = React.useState('');

  const sameFileAlert = () => {
    const msg = 'No folder name given. Please Enter a folder name.';
    return Alert.alert('Folder Name left Blank!!!', msg, [
      {
        text: 'OK',
        onPress: () => { },
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
      res.map(file => {
        const name = file.name;
        const details = {
          checked: false,
          currentAng: 1,
          uri: file.fileCopyUri,
        };
        dispatch(addPDForFolder(name, details, fullPath));
      });
    } catch (err) {
      console.log(err);
    }
    setVisibility(false);
  }

  const handleAddFolder = () => {
    if (folderName === '') {
      sameFileAlert();
      return;
    }
    // will erase all the files in the folder if same name
    dispatch(addPDForFolder(folderName, {}, fullPath));
    setFolderName('');
    setVisibility(false);
  };

  const styles = theStyles(darkMode);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisibility(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisibility(false)}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add a File or Folder</Text>
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Icon name="close" type="ionicon" size={24} color={darkMode ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>Add a Folder:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., Folder 1"
                placeholderTextColor="#999"
                value={folderName}
                onChangeText={setFolderName}
                onSubmitEditing={handleAddFolder}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddFolder}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.pickFileButton} onPress={pickDoc}>
              <Icon name="document-outline" type="ionicon" size={24} color={darkMode ? 'white' : 'black'} />
              <Text style={styles.pickFileButtonText}>Pick File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function theStyles(darkMode) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: allColors[darkMode].headerColor,
      width: '90%',
      borderRadius: 20,
      padding: 20,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      color: darkMode ? 'white' : 'black',
      fontWeight: 'bold',
    },
    content: {
      marginBottom: 20,
    },
    label: {
      color: darkMode ? 'white' : 'black',
      fontSize: 16,
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
      color: 'black',
      marginRight: 10,
    },
    submitBtn: {
      backgroundColor: allColors[darkMode].mainBackgroundColor,
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: darkMode ? 'white' : 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pickFileButton: {
      flexDirection: 'row',
      backgroundColor: allColors[darkMode].mainBackgroundColor,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pickFileButtonText: {
      color: darkMode ? 'white' : 'black',
      fontSize: 16,
      marginLeft: 10,
    },
  });
}
