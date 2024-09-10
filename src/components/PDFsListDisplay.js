import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import {setCheckBox, setPDFStar} from '../../redux/actions.js';
import {MainBar} from './mainBarOpt.js';

export default function PDFsListDisplay({
  state,
  dispatch,
  navigation,
  dataObj,
  fullPath,
}) {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
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
            const isStared = state.staredPdfs.find(
              element => element.slice(-1)[0] === item,
            );
            return (
              <MainBar
                state={state}
                isFolder={isFolder}
                text={item}
                onClick={() => {
                  if (isFolder) {
                    let theDataObj = getItemFromFullPath(
                      state.allPdfs,
                      fullPath,
                    )[item];

                    let screenName = 'PdfListScreen';
                    if (
                      item === 'Added PDFs' ||
                      (fullPath.length > 0 && fullPath[0] === 'Added PDFs')
                    ) {
                      screenName = 'AddedPdfs';
                    }

                    navigation.push(screenName, {
                      dataObj: theDataObj,
                      title: item,
                      fullPath: [...fullPath, item],
                    });
                  } else {
                    navigation.navigate('OpenPdf', {
                      pdfTitle: item,
                      fullPath: [...fullPath],
                    });
                  }
                }}
                onCheckBoxClick={() => dispatch(setCheckBox(item, fullPath))}
                checked={
                  getItemFromFullPath(state.allPdfs, fullPath)[item]
                    ? getItemFromFullPath(state.allPdfs, fullPath)[item].checked
                    : false
                }
                isStared={isStared}
                onStarClick={() => dispatch(setPDFStar(item, fullPath))}
              />
            );
          }}
        />
      </View>
    </View>
  );
}
