import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions} from 'react-native';
const RNFS = require('react-native-fs');

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
