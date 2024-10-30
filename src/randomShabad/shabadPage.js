import React from 'react';
import {
  Alert,
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Icon, Switch} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {allColors} from '../../assets/styleForEachOption';
import {addToShabadHistory, clearHistory} from '../../redux/actions';
import {RightOfHeader} from '../components/rightOfHeader.js';
import {ALLSHABADS} from '../../assets/allShabads.js';
import {BarOption} from '../components/baroption.js';

export function ShabadScreen({navigation}) {
  const dispatch = useDispatch();
  let state = useSelector(theState => theState.theReducer);

  React.useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: allColors[state.darkMode].headerColor,
      },
      title: 'Random Shabad',
      headerTintColor: state.darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: state.darkMode ? 'white' : 'black',
      },
      headerRight: () => (
        <RightOfHeader
          darkMode={state.darkMode}
          icons={[
            {
              name: 'settings-outline',
              action: () => {
                navigation.navigate('Settings Page');
              },
            },
          ]}
        />
      ),
    });
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    openShabadBtn: {
      backgroundColor: allColors[state.darkMode].shabadPage.openShabadBtn,
      alignItems: 'center',
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    eachPage: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
    },
  });

  const pages = [
    <SearchShabad
      key={'2'}
      state={state}
      dispatch={dispatch}
      navigation={navigation}
    />,
    <ShabadHistoryView
      key={'1'}
      state={state}
      dispatch={dispatch}
      navigation={navigation}
    />,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.openShabadBtn}
        onPress={() => {
          const theID = getRandomShabadId();
          const theObj = {shabadId: theID, saved: false};
          navigation.navigate('ReadShabad', {
            shabadData: theObj,
            index: state.shabadHistory.length,
            type: 'shabad',
          });
          dispatch(addToShabadHistory(theObj));
        }}>
        <Text
          style={{
            color: state.darkMode ? 'white' : 'black',
          }}>
          Open Random Shabad
        </Text>
      </TouchableOpacity>
      <FlatList
        data={pages}
        horizontal
        showsHorizontalScrollIndicator
        pagingEnabled
        renderItem={({item}) => {
          return item;
          //return <View style={styles.eachPage}>{item}</View>;
        }}
      />
    </SafeAreaView>
  );
}

function SearchShabad({state, navigation, dispatch}) {
  const [searchText, setSeach] = React.useState('');
  const [lstData, setLstData] = React.useState([]);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      width: Dimensions.get('window').width,
    },
    titleText: {
      color: state.darkMode ? 'white' : 'black',
    },
    bar: {
      width: Dimensions.get('window').width,
    },
    search: {
      backgroundColor: '#a2d5c6',
      borderRadius: 5,
      margin: 5,
      padding: 5,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder={'Search For Shabad'}
        placeholderTextColor="white"
        value={searchText}
        onSubmitEditing={() => {
        }}
        onChangeText={txt => {
          setSeach(txt);
          if(txt===''){
            setLstData([])
            return
          }

          const theLst = []
          const enteredText = txt.toLowerCase().split(' ')

          Object.entries(ALLSHABADS).filter(([ID, shabadLst]) => { // find shabads that have the entered words in them
            let matchedLine; //will line matched with the last word
            let allWordsInShabad = true;

            for(const word of enteredText){
              const wrdInSbd = shabadLst.some(line => {
                matchedLine = line;
                return line.toLowerCase().includes(word.toLowerCase());
              });
              if(!wrdInSbd){
                allWordsInShabad = false;
                break
              } 
            }
            if (allWordsInShabad) {
              theLst.push([ID,matchedLine])
              return []; // no matter what I return, it will return the ID,shabadLst parameter that went into the function
            }
          });
          setLstData(theLst);
        }}
      />
      <Text style={styles.titleText}>{lstData.length} Shabads Found</Text>
      <FlatList
        data={lstData}
        keyExtractor={item => item[0]} //ID
        renderItem={({item, index}) => {
          return (
            <View style={styles.bar}>
              <BarOption
                darkMode={state.darkMode}
                onClick={() => {
                  const theID = item[0];
                  const theObj = {shabadId: theID, saved: false};
                  navigation.navigate('ReadShabad', {
                    shabadData: theObj,
                    index: state.shabadHistory.length,
                    type: 'shabad',
                  });
                  dispatch(addToShabadHistory(theObj));
                }}
                left={
                  <Icon
                    name="reader-outline"
                    type="ionicon"
                    color={state.darkMode ? 'white' : 'black'}
                  />
                }
                /* text={getShabadTitle(item[0])} */
                text={item[1]}
                right={
                  <Icon
                    name="arrow-forward-outline"
                    size={25}
                    type="ionicon"
                    color={state.darkMode ? 'white' : 'black'}
                  />
                }
              />
            </View>
          );
        }}
      />
    </View>
  );
}


function ShabadHistoryView({state, dispatch, navigation}) {
  const [showSaved, setShowSaved] = React.useState(false);
  const [listOfData, setListOfData] = React.useState(
    state.shabadHistory.slice().reverse(),
  );

  function getShabadTitle(id) {
    return ALLSHABADS[id][0].slice(0, 30).replace(/\n/g, ' ') + '...';
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      setListOfData(state.shabadHistory.slice().reverse());
      console.log('Shabad history refreshed look');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      margin: 5,
      padding: 5,
      width: Dimensions.get('window').width,
      //backgroundColor: 'blue',
    },
    bar: {
      width: Dimensions.get('window').width,
    },
    titleText: {
      color: state.darkMode ? 'white' : 'black',
    },
  });
  //console.log(listOfData)
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {showSaved ? 'Saved Shabads' : 'All History'}
      </Text>
      <Switch
        value={showSaved}
        onValueChange={newSetting => {
          setShowSaved(newSetting);
        }}
      />
      <FlatList
        data={listOfData}
        keyExtractor={item => item.shabadId + Math.random()} //incase shabadId is same twice
        renderItem={({item, index}) => {
          //item={"saved": false, "shabadId": "EWD"}
          if (showSaved && !item.saved) return;
          return (
            <View style={styles.bar}>
              <BarOption
                darkMode={state.darkMode}
                onClick={() => {
                  navigation.navigate('ReadShabad', {
                    shabadData: item,
                    index: listOfData.length - 1 - index,
                    type: 'shabad',
                  });
                }}
                left={
                  <Icon
                    name="reader-outline"
                    type="ionicon"
                    color={state.darkMode ? 'white' : 'black'}
                  />
                }
                text={getShabadTitle(item.shabadId)}
                right={
                  <Icon
                    name="arrow-forward-outline"
                    size={25}
                    type="ionicon"
                    color={state.darkMode ? 'white' : 'black'}
                  />
                }
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <BarOption
            darkMode={state.darkMode}
            onClick={() => {
              const theID = getRandomShabadId();
              const theObj = {shabadId: theID, saved: false};
              navigation.navigate('ReadShabad', {
                shabadData: theObj,
                index: 0, //this will only show up if list is empty so automaticly know its 0
              });
              dispatch(addToShabadHistory(theObj));
            }}
            left={
              <Icon
                name="reader-outline"
                type="ionicon"
                color={state.darkMode ? 'white' : 'black'}
              />
            }
            text={'Click Here to Open Shabad.       '}
            right={
              <Icon
                name="arrow-forward-outline"
                size={25}
                type="ionicon"
                color={state.darkMode ? 'white' : 'black'}
              />
            }
          />
        }
      />
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Delete All Shabad History!',
            "By Clicking 'OK', You will delete all your history. This can not be undone.",
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  dispatch(clearHistory());
                  navigation.goBack(); // it didn't refresh right away so go back when you delete all history
                },
              },
            ],
          );
          dispatch(clearHistory());
        }}>
        <Icon
          name="trash-outline"
          size={25}
          type="ionicon"
          color={state.darkMode ? 'white' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
}

export function getRandomShabadId() {
  const keys = Object.keys(ALLSHABADS);
  const prop = keys[Math.floor(Math.random() * keys.length)];
  return prop;
}
