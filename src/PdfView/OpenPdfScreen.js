import React from 'react';
import {
  useWindowDimensions,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {Slider} from '@miblanchard/react-native-slider';
import {RightOfHeader} from '../components/rightOfHeader.js';

import Pdf from 'react-native-pdf';
import {useSelector, useDispatch} from 'react-redux';
import {setAngNum} from '../../redux/actions.js';
import {allColors} from '../../assets/styleForEachOption.js';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import PdfInfoModal from './PdfInfoModal.js';
import {isPortrait} from '../utils.js';

export default function OpenPdfScreen({navigation, route}) {
  const [totalAngs, setTotalAngs] = React.useState(0);
  const [currentAng, setCurrentAng] = React.useState(1);
  const [headerShown, setHeaderShown] = React.useState(true);
  const [showPdfModal, setPdfModal] = React.useState(false);

  const currentAngRef = React.useRef(1); //only for addListner
  const pdfRef = React.useRef(null);

  const state = useSelector(theState => theState.theReducer);
  const dispatch = useDispatch();

  const {pdfTitle} = route.params;
  const {fullPath} = route.params;
  const fileObj = getItemFromFullPath(state.pdf.allPdfs, [...fullPath, pdfTitle]);
  console.log({fileObj});

  const sourceFileName = {
    uri: fileObj.uri,
    cache: true,
  };

  React.useEffect(() => {
    pdfRef.current.setPage(fileObj.currentAng);
    navigation.addListener('beforeRemove', () => {
      dispatch(setAngNum(fullPath, pdfTitle, currentAngRef.current));
    });
  }, [navigation, totalAngs]);

  React.useEffect(() => {
    if (showPdfModal) setHeaderShown(false);
  }, [showPdfModal]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: allColors[state.darkMode].mainBackgroundColor,
    },
    pdf: {
      width: '100%',
      height: '100%',
      borderRadius: 15,
    },
  });

  return (
    <View style={styles.container}>
      <Pdf
        style={styles.pdf}
        ref={pdfRef}
        source={sourceFileName}
        activityIndicator={<ActivityIndicator size="large" color="blue" />}
        onLoadComplete={(numberOfPages, filePath) => {
          setTotalAngs(numberOfPages);
        }}
        onPageChanged={page => {
          setCurrentAng(page);
          currentAngRef.current = page;
        }}
        onPageSingleTap={() => {
          setHeaderShown(!headerShown);
        }}
        onError={error => {
          const strError = String(error);
          if (strError === 'Error: canceled') return;
          Alert.alert(
            'PDF ERROR',
            strError,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
          console.log(error);
          return;
        }}
        onPressLink={uri => {
          console.log(`Link presse: ${uri}`);
        }}
      />
      {headerShown ? (
        <Header
          title={pdfTitle}
          currentAng={currentAng}
          totalAngs={totalAngs}
          state={state}
          dispatch={dispatch}
          navigation={navigation}
          pdfRef={pdfRef}
          setPdfModal={setPdfModal}
        />
      ) : (
        <></>
      )}
      <PdfInfoModal
        visible={showPdfModal}
        setHeaderShown={setHeaderShown}
        setVisibility={setPdfModal}
        state={state}
        pdfInfo={{...fileObj, pdfTitle: pdfTitle}}
      />
    </View>
  );
}

function Header({title, currentAng, totalAngs, state, navigation, pdfRef, setPdfModal}) {
  const [textInput, setInput] = React.useState('');
  const [range, setRange] = React.useState('');
  const angNumFontSize = 25;
  const darkMode = state.darkMode;

  const {height} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      flexDirection: 'column',
      bottom: isPortrait() ? height - 160 : height - 130,
      width: '100%',
      alignItems: 'center',
    },
    headerContainer: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: allColors[state.darkMode].headerColor,
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 15,
      borderRadius: 10,
    },
    title: {
      backgroundColor: '#077b8a',
      padding: 5,
      borderRadius: 5,
      textAlign: 'center',
      color: state.darkMode ? 'white' : 'black',
    },
    angNumInfo: {
      padding: 1,
      margin: 5,
      borderRadius: 5,
      backgroundColor: '#078b8a',
      flexDirection: 'row',
      alignItems: 'center',
    },
    setAngNumBox: {
      margin: 3,
      padding: 5,
      borderRadius: 5,
      backgroundColor: '#a2d5c6',
      textAlign: 'right',
      fontSize: angNumFontSize,
    },
    totalAngsInfo: {
      fontSize: angNumFontSize,
    },
    slider: {
      backgroundColor: 'grey',
      flex: 1,
      /* left: 20, */
      borderRadius: 5,
      width: '90%',
      /* alignItems: 'center', */
    },
  });
  let showTitle = title;
  if (showTitle.length > 10) showTitle = showTitle.slice(0, 7) + '..';
  const iconsSize = 25;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtns}>
          <Icon name="arrow-back-outline" size={iconsSize} type="ionicon" color={state.darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPdfModal(true)}>
          <Text style={styles.title}>{showTitle}</Text>
        </TouchableOpacity>
        <View style={styles.angNumInfo}>
          <TextInput
            style={styles.setAngNumBox}
            /* keyboardType="numeric" */
            placeholder={currentAng.toString()}
            placeholderTextColor="yellow"
            value={textInput}
            onSubmitEditing={e => {
              const num = Number.parseInt(e.nativeEvent.text, 10);
              setInput('');
              if (!num) return;
              pdfRef.current.setPage(num);
            }}
            onChangeText={txt => setInput(txt)}
          />
          <Text style={styles.totalAngsInfo}>/{totalAngs}</Text>
        </View>
        <View>
          <RightOfHeader
            darkMode={state.darkMode}
            icons={[
              {
                name: 'shuffle-outline',
                action: () => {
                  const randAng = Math.floor(Math.random() * totalAngs) + 1;
                  pdfRef.current.setPage(randAng);
                  console.log(randAng);
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
        </View>
      </View>
      <View style={styles.slider}>
        <Slider
          value={currentAng / totalAngs}
          onValueChange={value => pdfRef.current.setPage(Math.round(value * totalAngs))}
        />
      </View>
    </View>
  );
}
