import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions} from 'react-native';
const RNFS = require('react-native-fs');
import {allColors} from '../assets/styleForEachOption.js';
import {RightOfHeader} from './components/rightOfHeader.js';

/* async function mkdir(path) { */
/*   await RNFS.exists(path).then(dirExists => { */
/*     if (dirExists) { */
/*       console.log(path + ' exists'); */
/*     } else { */
/*       RNFS.mkdir(path); */
/*     } */
/*   }); */
/* } */
/**/
/* export async function downloadPDF(link) { */
/*   let destPath = RNFS.DocumentDirectoryPath + '/'; */
/**/
/*   const folders = link.split('/').splice(4); */
/*   for (let i = 0; i < folders.length - 1; i++) { */
/*     destPath += folders[i] + '/'; */
/*     await mkdir(destPath); */
/*   } */
/*   destPath += folders[folders.length - 1]; */
/**/
/*   let option = { */
/*     fromUrl: link, */
/*     toFile: destPath, */
/*   }; */
/*   RNFS.downloadFile(option).promise.then(res => { */
/*     console.log(destPath); */
/*     console.log('res -----------------------------> ', res); */
/*   }); */
/* } */

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
  if (isPortrait()) {
    return getStatusBarHeight() + 85;
  }
  return getStatusBarHeight() + 40;
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
  dataObj,
  fullPath,
  navigation,
  state,
) {
  // const title = route.params.title;
  // const dataObj = route.params.dataObj;
  // const fullPath = route.params.fullPath;

  const showTitle = title.length > 15 ? title.slice(0, 15) + '...' : title;
  return {
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
