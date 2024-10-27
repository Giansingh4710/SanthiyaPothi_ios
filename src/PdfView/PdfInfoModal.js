import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View, Modal, TextInput, Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {allColors} from '../../assets/styleForEachOption.js';


export default function PdfInfoModal({visible, setHeaderShown, setVisibility, state, pdfInfo}) {
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
            <Icon name="arrow-back-outline" type="ionicon" size={50} color={state.darkMode ? 'white' : 'black'} />
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
          *(the Current Saved Page is changed when you leave the pdf screen and not when you change pages in the pdf)
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
