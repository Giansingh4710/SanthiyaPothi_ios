import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export function BarOption({
  left,
  text,
  right,
  onClick,
  onLongPress,
  state,
  height,
}) {
  const {WIDTH} = useWindowDimensions();

  const styles = StyleSheet.create({
    itemContainer: {
      height: height,
      padding: 5,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: state.darkMode ? '#04293A' : '#ACDDDE',
      width: WIDTH,
      alignContent: 'space-between',
    },
    iconsInBar: {
      padding: 10,
      // backgroundColor:'red'
    },
    textWrap: {
      flex: 4,
      // backgroundColor:'red',barop
      // flex: 1,
    },
    titleText: {
      color: state.darkMode ? 'white' : 'black',
      padding: 5,
      // left: 12,
      // fontSize: 15,
    },
    gap: {
      height: 2,
    },
  });
  return (
    <View>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onClick()}
        onLongPress={onLongPress}>
        <View style={styles.iconsInBar}>{left}</View>
        <View style={styles.textWrap}>
          <Text style={styles.titleText}>{text}</Text>
        </View>
        <View style={styles.iconsInBar}>{right}</View>
      </TouchableOpacity>
      <View style={styles.gap} />
    </View>
  );
}
