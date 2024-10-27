import {FlashList} from '@shopify/flash-list';
import {StyleSheet, View} from 'react-native';

import TxtBaniBar from './TxtBaniBar.js';

export default function TxtBaniListDisplay({navigation, dataObj, fullPath}) {
  const keys = Object.keys(dataObj) || [];
  if (keys.length === 0) return null;
  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <FlashList
          keyExtractor={item => item}
          data={keys}
          estimatedItemSize={keys.length}
          initialNumToRender={30}
          renderItem={({item, index}) => (
            <TxtBaniBar bani_name={item} index={index} dataObj={dataObj} fullPath={fullPath} navigation={navigation} />
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
