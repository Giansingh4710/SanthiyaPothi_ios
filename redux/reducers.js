import AsyncStorage from '@react-native-async-storage/async-storage';
import {folderToFileDataPDFs} from '../assets/longData_pdf.js';
import {bani_display_order} from '../assets/longData_text.js';
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
  allPdfs: {...folderToFileDataPDFs},
  staredPdfs: [],
  fontSizeForShabad: 16,
  //addedPdfs: {title: 'Added PDFs', list: []},
  //shabadHistory:[{shabadId:'1YU',saved:false}],
  shabadHistory: [],

  pdfVersionList: true,
  allTextBanis: {...bani_display_order},
  staredTextBanis: [],
  textBaniSettings: {
    navigationRowOnTop: false,
    fontSize: 20,
    gurmukhiOn: true,
    larivaarOn: true,
    translationType: {
      en: '', // "", "bdb" , "ms" , "ssk"
      pu: '', // "", "ss" , "ft" , "bdb", "ms"
      es: '', // "", "sn" 
    },
    transliterationType: '', //'en', 'hi', 'ipa', 'ur' , ''
    fontType: 'AmrLipiHeavy',
    visraamType: 'igurbani', //can only be 'sttm' 'igurbani' 'sttm2' or ''
  },
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
      state.allPdfs = {...folderToFileDataPDFs};
      console.log('corrected pdf strucute');
    }
    theState = {...state};
  } else if (action.type === 'TOGGLE_PDF_VERSION_LIST') {
    const newState = {
      ...state,
      pdfVersionList: action.mode,
    };
    theState = newState;
  } else if (action.type === 'SET_SETTINGS_FOR_TEXT_BANI') {
    state.textBaniSettings = {...action.settings};
    theState = {...state};
  } else if (action.type === 'SET_FONT_FAMILY') {
    state.fontFor = action.fontFamily;
    theState = state;
  } else if (action.type === 'SET_TXT_BANI_CHECKBOX') {
    changePDFsObj(
      state.allTextBanis,
      action.theBani,
      action.fullPath,
      action.type,
    );
    theState = {...state};
  } else if (action.type === 'SET_PDF_STAR') {
    const itemIdx = state.staredPdfs.findIndex(
      baniPath => baniPath.slice(-1)[0] === action.item,
    );
    if (itemIdx === -1) {
      state.staredPdfs = [
        ...state.staredPdfs,
        [...action.fullPath, action.item],
      ];
    } else {
      state.staredPdfs.splice(itemIdx, 1);
    }
    theState = {...state};
  } else if (action.type === 'SET_TXT_BANI_STAR') {
    const itemIdx = state.staredTextBanis.findIndex(
      baniPath => baniPath.slice(-1)[0] === action.item,
    );
    if (itemIdx === -1) {
      state.staredTextBanis = [
        ...state.staredTextBanis,
        [...action.fullPath, action.item],
      ];
    } else {
      state.staredTextBanis.splice(itemIdx, 1);
    }
    theState = {...state};
  } else {
    return state;
  }
  setData('state', theState);
  return theState;
}

export default theReducer;
