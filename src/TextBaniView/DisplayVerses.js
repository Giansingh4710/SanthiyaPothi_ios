import React, {useRef, useState, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

export default function DisplayVerses({current_verses}) {
  const darkMode = useSelector(state => state.theReducer.darkMode);
  const showProgressBarForDisplayLines = useSelector(
    state => state.theReducer.text_bani.showProgressBarForDisplayLines,
  );
  const baniViewDiv = useRef(null);
  const baniInParts = useSelector(state => state.theReducer.text_bani.baniInParts);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currPangtiIndex, setCurrPangtiIndex] = useState(0);
  const styles = StyleSheet.create({
    container: {
      height: '100%',
      padding: 5,
      margin: 5,
      borderWidth: 1,
      borderColor: darkMode ? 'white' : 'black',
      borderRadius: 5,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: darkMode ? '#333' : '#e0e0e0',
      borderRadius: 2,
    },
    progressBar: {
      height: '100%',
      backgroundColor: darkMode ? '#76ff03' : '#4caf50',
      borderRadius: 2,
    },
  });

  useEffect(() => {
    baniViewDiv.current?.scrollToIndex({index: 0});
  }, [current_verses]);

  function handleScroll(event) {
    let progress = 0;
    if (baniInParts) {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      const scrollableHeight = contentSize.height - layoutMeasurement.height;
      const currentScrollPosition = contentOffset.y;
      progress = currentScrollPosition / scrollableHeight;
    } else {
      progress = currPangtiIndex / (current_verses.length - 1);
    }
    setScrollProgress(progress < 0 ? 0 : progress);
  }

  if (current_verses.length === 0) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: darkMode ? 'white' : 'black',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Waiting for data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={baniViewDiv}
        data={current_verses}
        onScroll={handleScroll}
        scrollEventThrottle={30}
        keyExtractor={item => item.verse.verseId}
        initialNumToRender={30}
        initialScrollIndex={0}
        estimatedItemSize={current_verses.length}
        onEndReached={() => {}}
        renderItem={({item, index}) => {
          return <Pantgi key={index} item={item} index={index} current_verses={current_verses} />;
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // Customize percentage to trigger the visibility change
        }}
        onViewableItemsChanged={({viewableItems}) => {
          if (viewableItems.length > 0) {
            const lastVisibleItemIndex = viewableItems[viewableItems.length - 1].index;
            setCurrPangtiIndex(lastVisibleItemIndex); // Set the last visible pangti index
          }
        }}
      />
      {showProgressBarForDisplayLines && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {width: `${scrollProgress * 100}%`}]} />
        </View>
      )}
    </View>
  );
}

function Pantgi({item, index, current_verses}) {
  // item is object from verses array exp: ../assets/bani_data/aarti.json
  const {fontSize, fontType, gurmukhiOn, larivaarOn, translationType, transliterationType, visraamType} = useSelector(
    theState => theState.theReducer.text_bani,
  );
  const darkMode = useSelector(state => state.theReducer.darkMode);
  const [isLarivaar, setIsLarivaar] = useState(larivaarOn);

  useEffect(() => setIsLarivaar(larivaarOn), [larivaarOn]);

  function Spacer() {
    const add_space = item.paragraph === current_verses[index + 1]?.paragraph ? false : true;
    if (add_space) {
      return (
        <View>
          {/* <Text>{translationsOn ? '\n' : ''}</Text> */}
          <Text>{false ? '\n' : ''}</Text>
        </View>
      );
    }
  }

  function GurmukhiLine() {
    if (!gurmukhiOn) return <></>;
    // const vis = true;

    const pangti = fontType === 'unicode' ? item.verse.verse.unicode : item.verse.verse.gurmukhi;

    const words = pangti.split(' ');

    const larivaarLine = fontType === 'unicode' ? pangti.replace(/ /g, '') : item.verse.larivaar.gurmukhi;

    const visraams = new Map();
    try {
      item.verse.visraam[visraamType].forEach(obj => visraams.set(obj.p, obj.t));
    } catch (e) {
      console.log(e);
    }

    return (
      <TouchableOpacity onPress={() => setIsLarivaar(!isLarivaar)}>
        <Text
          style={{
            fontFamily: fontType !== 'unicode' ? fontType : null,
            fontSize: fontSize,
            flexWrap: 'wrap', // ensures that the text wraps within the container
          }}>
          {words.map((word, i) => {
            let wordColor = darkMode ? 'white' : 'black';
            if (visraams.has(i)) {
              const type = visraams.get(i);
              wordColor = type === 'v' ? 'green' : 'orange';
            }
            return (
              <Text key={i} style={{color: wordColor}}>
                {word}
                {!isLarivaar && i < words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
      </TouchableOpacity>
    );
  }

  function TranslationLine() {
    const en = item.verse.translation.en[translationType.en];
    const es = item.verse.translation.es[translationType.es];
    let pu = item.verse.translation.pu[translationType.pu];
    pu = fontType === 'unicode' ? pu?.unicode : pu?.gurmukhi;

    const list = [];
    if (en) {
      list.push(<Text style={{color: darkMode ? 'white' : 'black'}}> {en} </Text>);
    }
    if (pu) {
      list.push(
        <Text
          style={{
            color: darkMode ? 'white' : 'black',
            fontFamily: fontType !== 'unicode' ? fontType : null,
          }}>
          {pu}
        </Text>,
      );
    }
    if (es) {
      list.push(<Text style={{color: darkMode ? 'white' : 'black'}}> {es} </Text>);
    }
    return list;
  }

  function TransliterationLine() {
    if (item.verse.transliteration[transliterationType]) {
      return (
        <Text style={{color: darkMode ? 'white' : 'black', padding: 3}}>
          {item.verse.transliteration[transliterationType]}
        </Text>
      );
    }
  }

  return (
    <View style={{}}>
      <GurmukhiLine />
      <TranslationLine />
      <TransliterationLine />
      <Spacer />
    </View>
  );
}
