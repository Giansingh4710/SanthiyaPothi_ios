import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
} from 'react-native';
import {Icon, CheckBox} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  setTheState,
  correctPDFstate,
  addToShabadHistory,
} from '../redux/actions';
import {initialState} from '../redux/reducers';
import {allColors} from '../assets/styleForEachOption';
import {getRandomShabadId, BanisList} from './shabadPage/shabadPage.js';
import {BarOption} from '../assets/components/baroption';
import {RightOfHeader} from '../assets/components/rightOfHeader';
import {Add_Or_Del_Folder_or_File} from '../assets/components/add_or_del_item_Modal.js';
import {getItemFromFullPath} from '../assets/helper_funcs.js';

import {setCheckBox} from '../redux/actions';
import {heightOfBar} from './utils.js';

function TheListDisplayScreen({navigation, route}) {
  const dispatch = useDispatch();
  let state = useSelector(theState => theState.theReducer);
  React.useEffect(() => {
    async function getData() {
      try {
        const theStringState = await AsyncStorage.getItem('state');
        let theState;
        if (theStringState) {
          theState = JSON.parse(theStringState);
          console.log('got state that was previously saved');
        } else {
          console.log('there is nothing is state');
          theState = initialState;
        }
        state = theState;
        dispatch(setTheState(theState));
        dispatch(correctPDFstate());
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }
    getData();
  }, []);

  React.useEffect(() => {
    let showTitle = route.params.title;
    if (showTitle.length > 15) showTitle = showTitle.slice(0, 15) + '...';
    navigation.setOptions({
      title: showTitle,
      headerStyle: {
        backgroundColor: allColors[state.darkMode].headerColor,
        height: heightOfBar(),
      },
      headerContainerStyle: {padding: 50},
      headerTintColor: state.darkMode ? 'white' : 'black',
      headerTitleStyle: {
        color: state.darkMode ? 'white' : 'black',
      },
      headerRight: () => (
        <RightOfHeader
          state={state}
          icons={[
            {
              name: 'open-outline',
              action: () => navigation.navigate('ShabadScreen'),
            },
            {
              name: 'shuffle-outline',
              action: () => {
                const items = Object.keys(route.params.dataObj);
                if (items.length === 0) return;

                const item = items[Math.floor(Math.random() * items.length)];
                if (route.params.dataObj[item].currentAng) {
                  navigation.navigate('OpenPdf', {
                    pdfTitle: item,
                    fullPath: [...route.params.fullPath],
                  });
                } else {
                  let theDataObj = route.params.dataObj[item];
                  navigation.push('Home', {
                    dataObj: theDataObj,
                    title: item,
                    fullPath: [...route.params.fullPath, item],
                  });
                }
              },
            },
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

  if (route.params.addedPdfs) {
    return (
      <AddedPDFsScreen
        state={state}
        dispatch={dispatch}
        params={route.params}
        navigation={navigation}
      />
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
      height: '100%',
    },
    listContainer: {
      // height: route.params.title === 'Santhiya Pothi' ? '50%' : '100%',
      flex: 2,
      margin: 5,
    },
    banisList: {
      height: '30%',
      width: '100%',
    },
    mainBottom: {
      flex: 1,
      margin: 5,
      // backgroundColor:'red',
    },
    banisList: {
      flex: 1,
      margin: 5,
      // height:'30%',
      // width:'100%',
    },
    openShabadBtn: {
      backgroundColor: allColors[state.darkMode].shabadPage.openShabadBtn,
      alignItems: 'center',
      borderRadius: 5,
      padding: 15,
      margin: 10,
    },
  });

  function ShowBanisToRead() {
    //only want to show bania on main screen
    if (route.params.title !== 'Santhiya Pothi') return <></>;
    return (
      <View style={styles.mainBottom}>
        <View style={styles.banisList}>
          <BanisList state={state} navigation={navigation} />
        </View>
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
          <Text style={{color: state.darkMode ? 'white' : 'black'}}>
            Open Random Shabad
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <ListDisplay
          state={state}
          dispatch={dispatch}
          params={route.params}
          navigation={navigation}
        />
      </View>
      <ShowBanisToRead />
    </SafeAreaView>
  );
}

function ListDisplay({state, dispatch, params, navigation}) {
  const dataObj = params.dataObj;
  const fullPath = params.fullPath;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    scroll: {
      width: '100%',
      height: '100%',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <FlatList
          keyExtractor={item => item} //name of each item like 'Bai Vaara'
          data={Object.keys(dataObj)}
          initialNumToRender={30}
          renderItem={({item}) => {
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
                  isFolder ? (
                    <Icon
                      name="arrow-forward-outline"
                      type="ionicon"
                      color={state.darkMode ? 'white' : 'black'}
                    />
                  ) : (
                    <CheckBox
                      checked={
                        getItemFromFullPath(state.allPdfs, fullPath)[item]
                          ? getItemFromFullPath(state.allPdfs, fullPath)[item]
                              .checked
                          : false
                      }
                      checkedColor="#0F0"
                      checkedTitle="ਸੰਪੂਰਨ"
                      containerStyle={{
                        borderRadius: 10,
                        //padding: 10,
                        backgroundColor: 'black',
                      }}
                      onPress={() => {
                        dispatch(setCheckBox(item, fullPath));
                      }}
                      //size={20}
                      textStyle={{
                        fontSize: 10,
                        height: 20,
                        color: 'white',
                      }}
                      title="Not Done"
                      titleProps={{}}
                      uncheckedColor="#F00"
                    />
                  )
                }
                onClick={() => {
                  if (isFolder) {
                    let theDataObj = getItemFromFullPath(
                      state.allPdfs,
                      fullPath,
                    )[item];
                    const addedPdfs = item === 'Added PDFs' || params.addedPdfs;
                    navigation.push('Home', {
                      dataObj: theDataObj,
                      title: item,
                      fullPath: [...fullPath, item],
                      addedPdfs,
                    });
                  } else {
                    navigation.navigate('OpenPdf', {
                      pdfTitle: item,
                      fullPath: [...fullPath],
                    });
                  }
                }}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

function AddedPDFsScreen({state, dispatch, params, navigation}) {
  const [visible, setVisibility] = React.useState(false);
  const [typeOfModal, setTypeOfModal] = React.useState('');

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
        <ListDisplay
          state={state}
          dispatch={dispatch}
          params={params}
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
        fullPath={params.fullPath}
        navigation={navigation}
        actionType={typeOfModal}
      />
    </View>
  );
}

export default TheListDisplayScreen;
