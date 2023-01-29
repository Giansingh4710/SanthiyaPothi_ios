import React from 'react';
import {FlatList, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Icon, Switch} from 'react-native-elements';
import {allColors} from '../../assets/styleForEachOption';
import {setFontSize, toggleSaveForShabad} from '../../redux/actions';
import {ALLSHABADS} from '../../assets/allShabads.js';
import {useDispatch, useSelector} from 'react-redux';
import {RightOfHeader} from '../../assets/components/rightOfHeader';
import {heightOfBar} from '../utils.js';

export default function ReadShabad({navigation, route}) {
  const dispatch = useDispatch();
  let state = useSelector(theState => theState.theReducer);
  const modalInfo = route.params;
  const shabad =
    modalInfo.type === 'bani'
      ? modalInfo.bani
      : ALLSHABADS[modalInfo.shabadData.shabadId];
  const [fontsz, setfontsz] = React.useState(state.fontSizeForShabad);
  const [larrivar, setLarrivar] = React.useState(true);
  const [percentageComplete, setPercentageComplete] = React.useState(1);
  const [shabadSaved, setSavedShabad] = React.useState(
    modalInfo.shabadData ? modalInfo.shabadData.saved : false,
  );

  React.useEffect(() => {
    if (modalInfo.shabadData) setSavedShabad(modalInfo.shabadData.saved);
  }, [modalInfo]);

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: allColors[state.darkMode].headerColor,
        height: heightOfBar(),
      },
      title: modalInfo.bani ? modalInfo.bani_name : 'Random Shabad',
      headerTintColor: state.darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: state.darkMode ? 'white' : 'black',
      },
      headerRight: () => (
        <RightOfHeader
          state={state}
          icons={
            modalInfo.type === 'shabad'
              ? [
                  {
                    name: shabadSaved ? 'bookmark' : 'bookmark-outline',
                    color: state.darkMode ? 'white' : 'black',
                    action: () => {
                      dispatch(toggleSaveForShabad(modalInfo.index));
                      setSavedShabad(prev => !prev);
                    },
                  },
                  {
                    name: 'settings-outline',
                    action: () => {
                      navigation.navigate('Settings Page');
                    },
                  },
                ]
              : [
                  {
                    name: 'settings-outline',
                    action: () => {
                      navigation.navigate('Settings Page');
                    },
                  },
                ]
          }
        />
      ),
    });
  });

  function fontszGood(num) {
    if (num < 10) return 'small'; //too small
    if (num > 24) return 'big'; // too big
    return true;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: allColors[state.darkMode].readShabad.container,
      padding: 10,
      //borderRadius: 5,
      //width: WIDTH,
    },
    completionLine: {
      borderColor: 'grey',
      borderWidth: 5,
      margin: 3,
      width: '100%',
    },
    headerContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      padding: 10,
    },
    plusMinusRow: {
      margin: 5,
      flexDirection: 'row',
    },
    bottomActions: {
      marginHorizontal: 10,
    },
    text: {
      color: state.darkMode ? 'white' : 'black',
    },
    gurbaniScrollView: {
      /* backgroundColor: '#888', */
      borderColor: state.darkMode ? 'white' : 'black',
      borderWidth: 1,
      height: '90%',
      padding: 10,
      borderRadius: 10,
    },
    shabadText: {
      fontSize: fontsz,
      color: state.darkMode ? 'white' : 'black',
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{...styles.completionLine, width: percentageComplete}}></View>
      <View style={styles.gurbaniScrollView}>
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={shabad}
          renderItem={({item, index}) => {
            /* console.log(index, 'rendered out of', shabad.length); */
            setPercentageComplete(
              Math.round((index * 100) / shabad.length).toString() + '%',
            );
            if (index % 2 === 0) {
              //gurbani pangti
              return (
                <ShabadLine
                  larrivar={larrivar}
                  padChedLine={item}
                  shabadTextStyle={styles.shabadText}
                />
              );
            }
            return (
              <Text style={styles.shabadText}>
                {item}
                {'\n'}
              </Text>
            );
          }}
        />
      </View>
      <View style={styles.plusMinusRow}>
        <View style={styles.bottomActions}>
          <Icon
            name="remove-outline"
            type="ionicon"
            onPress={() => {
              if (fontszGood(fontsz) === 'small') return;
              setfontsz(prev => prev - 1);
              dispatch(setFontSize(fontsz));
            }}
            size={fontsz * 2}
            color={state.darkMode ? 'white' : 'black'}
          />
        </View>
        <View style={styles.bottomActions}>
          <Switch
            value={larrivar}
            onValueChange={newSetting => {
              setLarrivar(newSetting);
            }}
          />
          <Text style={styles.text}>larrivar</Text>
        </View>
        <View style={styles.bottomActions}>
          <Icon
            size={fontsz * 2}
            color={state.darkMode ? 'white' : 'black'}
            name="add-outline"
            type="ionicon"
            onPress={() => {
              if (fontszGood(fontsz) === 'big') return;
              setfontsz(prev => prev + 1);
              dispatch(setFontSize(fontsz));
            }}
          />
        </View>
      </View>
    </View>
  );
}

function ShabadLine({larrivar, padChedLine, shabadTextStyle}) {
  const larrivarLine = padChedLine.replace(/ /g, '');
  const [lineIsLarrivar, setLarrivar] = React.useState(larrivar); //true=larrivar false=padChed

  React.useEffect(() => {
    setLarrivar(larrivar);
  }, [larrivar]);
  return (
    <TouchableOpacity
      onPress={() => {
        setLarrivar(!lineIsLarrivar);
      }}
      onLongPress={() => {
        Clipboard.setString(lineIsLarrivar ? larrivarLine : padChedLine);
      }}>
      <Text style={shabadTextStyle}>
        {lineIsLarrivar ? larrivarLine : padChedLine}
      </Text>
    </TouchableOpacity>
  );
}
