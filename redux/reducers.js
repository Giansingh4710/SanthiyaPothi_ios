import AsyncStorage from '@react-native-async-storage/async-storage';
import {folderToFileData} from '../assets/longData';
import {changePDFsObj} from '../assets/helper_funcs.js';

export const setData = async (title, state) => {
  try {
    await AsyncStorage.setItem(title, JSON.stringify(state));
  } catch (e) {
    console.log(e);
  }
};

export const initialState = {
  darkMode: true,
  hideHeaderOnScroll: true,
  showHeaderOnScroll: true,
  allPdfs: {...folderToFileData},
  fontSizeForShabad: 16,
  //addedPdfs: {title: 'Added PDFs', list: []},
  //shabadHistory:[{shabadId:'1YU',saved:false}],
  shabadHistory: [],
};

/* setData('state', initialState); //to reset all state */

function theReducer(state = initialState, action) {
  let theState;
  if (action.type === 'SET_THE_STATE') {
    theState = {...action.state};
  } else if (action.type === 'SET_CHECKBOX') {
    changePDFsObj(state.allPdfs, action.theBani, action.fullPath, action.type);
    theState = {...state};
  } else if (action.type === 'SET_ANG_NUM') {
    changePDFsObj(state.allPdfs, action.theBani, action.fullPath, action.type, {
      angNum: action.angNum,
    });
    theState = {...state};
  } else if (action.type === 'SET_DARK_MODE') {
    const newState = {
      ...state,
      darkMode: action.mode,
    };
    theState = newState;
  } else if (action.type === 'SET_HIDE_HEADER') {
    const newState = {
      ...state,
      hideHeaderOnScroll: action.mode,
    };
    theState = newState;
  } else if (action.type === 'SET_SHOW_HEADER') {
    const newState = {
      ...state,
      showHeaderOnScroll: action.mode,
    };
    theState = newState;
  } else if (action.type === 'ADD_PDF_OR_FOLDER') {
    changePDFsObj(state.allPdfs, action.key, action.fullPath, action.type, {
      value: action.value,
    });
    theState = {...state};
  } else if (action.type === 'DELETE_PDF_OR_FOLDER') {
    changePDFsObj(state.allPdfs, action.key, action.fullPath, action.type);
    theState = {...state};
  } else if (action.type === 'SET_FONT_SIZE') {
    state.fontSizeForShabad = action.fontSize;
    theState = state;
  } else if (action.type === 'ADD_TO_SHABAD_HISTORY') {
    state.shabadHistory.push(action.shabadObj);
    theState = state;
  } else if (action.type === 'CLEAR_HISTORY') {
    state.shabadHistory = [];
    theState = state;
  } else if (action.type === 'TOGGLE_SAVE_FOR_SHABAD') {
    const oldState = state.shabadHistory[action.index].saved;
    state.shabadHistory[action.index].saved = !oldState;
    theState = state;
    console.log(state.shabadHistory[action.index]);
  } else if (action.type === 'CORRECT_PDF_STATE') {
    //FOR build Version 3
    if (
      state.allPdfs['Nitnem']['Nitnem Larrivaar']['uri'] !==
      'https://santhiyapothi.xyz/pdfs/Nitnem/Nitnem.pdf'
    ) {
      state.allPdfs = {...folderToFileData};
      console.log('corrected pdf strucute');
    }
    theState = {...state};
  } else {
    return state;
  }
  setData('state', theState);
  return theState;
}

export default theReducer;
