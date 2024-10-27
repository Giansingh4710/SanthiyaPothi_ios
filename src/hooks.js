import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {chooseTheState} from '../assets/helper_funcs.js';
import {initialState} from '../redux/reducers.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {setTheState, setAllPdfs, setAllTextBanis, setAllPartitions} from '../redux/actions.js';

export const useInitializeData = () => {
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getDataFromLocalStorage() {
      let choosenState;
      try {
        const stringState = await AsyncStorage.getItem('state');
        choosenState = chooseTheState(initialState, JSON.parse(stringState));
      } catch (error) {
        choosenState = initialState;
        console.error('Error retrieving or processing state:', error);
      }

      // console.log(choosenState.text_banis)
      dispatch(setTheState(choosenState));
      setIsLocalStorageLoaded(true);
    }

    getDataFromLocalStorage();
  }, [dispatch]);

  // Only fetch API data after local storage is loaded and processed
  useEffect(() => {
    if (!isLocalStorageLoaded) {
      return;
    }
    fetch('https://santhiyapothi.xyz/api/text_banis/bani_display_order.json', {cache: 'no-cache'})
      .then(res => res.json())
      .then(data => {
        dispatch(setAllTextBanis(data));
      });
    fetch('https://santhiyapothi.xyz/api/text_banis/banis_partitions.json', {cache: 'no-cache'})
      .then(res => res.json())
      .then(data => {
        dispatch(setAllPartitions(data));
      });
    fetch('https://santhiyapothi.xyz/api/pdf_display_data.json', {cache: 'no-cache'})
      .then(res => res.json())
      .then(data => {
        dispatch(setAllPdfs(data));
      });
  }, [isLocalStorageLoaded, dispatch]);

  return null;
};
