import React from 'react';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

export function RightOfHeader({icons, state}) {
  const styles = StyleSheet.create({
    container: {
      //backgroundColor: 'red',
      flexDirection: 'row',
      flex: 1,
    },
    headerBtns: {
      justifyContent: 'center',
      flex: 1,
      padding: 10,
    },
  });

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={icons}
      keyExtractor={item => item.name}
      renderItem={({item}) => {
        return (
          <TouchableOpacity
            onPress={() => item.action()}
            style={styles.headerBtns}>
            <Icon
              name={item.name}
              type="ionicon"
              color={state.darkMode ? 'white' : 'black'}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
}
