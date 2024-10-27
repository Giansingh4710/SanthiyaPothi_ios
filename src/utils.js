import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions} from 'react-native';
const RNFS = require('react-native-fs');
import {allColors} from '../assets/styleForEachOption.js';
import {RightOfHeader} from './components/rightOfHeader.js';

export function deleteAllCache() {
  const pdfPath = `${RNFS.CachesDirectoryPath}`;
  RNFS.readDir(pdfPath)
    .then(result => {
      result.forEach(pdf => {
        if (pdf.name.endsWith('.pdf')) {
          RNFS.unlink(`${pdfPath}/${pdf.name}`)
            .then(() => {
              console.log(`${pdf.name} deleted.`);
            })
            .catch(err => {
              console.log(err.message);
            });
        }
      });
    })
    .catch(err => {
      console.log(err.message);
    });
}

export function isPortrait() {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
}

export function heightOfBar() {
  if (isPortrait()) { return 90; }
  return 50
}

const alertMsg = msg => {
  return Alert.alert('Oops!!', msg, [
    {
      text: 'OK',
      onPress: () => {},
    },
  ]);
};

export function navigatorHearderObj(
  title,
  navigation,
  darkMode,
) {
  const showTitle = title.length > 15 ? title.slice(0, 15) + '...' : title;
  return {
    title: showTitle,
    headerStyle: {
      backgroundColor: allColors[darkMode].headerColor,
      height: heightOfBar(),
    },
    headerContainerStyle: {padding: 50},
    headerTintColor: darkMode ? 'white' : 'black',
    headerTitleStyle: {
      color: darkMode ? 'white' : 'black',
    },
    headerRight: () => (
      <RightOfHeader
        darkMode={darkMode}
        icons={[
          {
            name: 'open-outline',
            action: () => navigation.navigate('ShabadScreen'),
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
  };
}
