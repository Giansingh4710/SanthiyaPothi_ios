import {FlashList} from '@shopify/flash-list';
import {StyleSheet, View} from 'react-native';
import PdfBar from './PdfBar.js';

export default function PDFsListDisplay({navigation, dataObj, fullPath}) {
  const keys = Object.keys(dataObj) || [];
  if (keys.length === 0) return null;
  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <FlashList
          keyExtractor={item => item} //name of each item like 'Bai Vaara'
          data={keys}
          estimatedItemSize={keys.length}
          initialNumToRender={30}
          renderItem={({item}) => (
            <PdfBar bani_name={item} dataObj={dataObj} fullPath={fullPath} navigation={navigation} />
          )}
        />
      </View>
    </View>
  );
}

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
