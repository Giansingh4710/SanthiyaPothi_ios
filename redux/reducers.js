import AsyncStorage from '@react-native-async-storage/async-storage';
import {changePDFsObj, moveFileToFolder, starOrCheckItem} from '../assets/helper_funcs.js';

export const setData = async (title, state) => {
  try {
    await AsyncStorage.setItem(title, JSON.stringify(state));
  } catch (e) {
    console.log(e);
  }
};

export const initialState = {
  darkMode: true,
  cacheType: 'force-cache', // 'no-cache','force-cache'
  fontSizeForShabad: 16,
  shabadHistory: [], //shabadHistory:[{shabadId:'1YU',saved:false}],
  isPdfList: false,

  pdf: {
    allPdfs: {}, // from api
    addedPdfs: {},
    staredPdfs: {},
    checkedPdfs: {},
  },

  text_bani: {
    allTextBanis: {}, // from api
    bani_partitions: {}, // from api
    staredTextBanis: {},
    checkedTextBanis: {},
    cachedBanis: {}, // key: token, value: list of verses

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
    fontType: 'AmrLipiHeavy', // "AmrLipiHeavy", "AnmolLipi", "Choti Script 7 Bold", "GHW Adhiapak Black", "GHW Adhiapak Bold", "GHW Adhiapak Book", "GHW Adhiapak Chisel Blk", "GHW Adhiapak Extra Light", "GHW Adhiapak Light", "GHW Adhiapak Medium"
    visraamType: 'igurbani', //can only be 'sttm' 'igurbani' 'sttm2' or ''
    showProgressBarForDisplayLines: true,
    showProgressBarForWholeBani: true,
    baniInParts: true,
  },
};

// setData('state', initialState); //to reset all state */

function theReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_THE_STATE':
      state = {...action.state};
      break;
    case 'SET_ALL_PDF_BANIS':
      state.pdf.allPdfs = {
        ...action.allPdfs,
        'Added PDFs': state.pdf.addedPdfs,
      };
      break;
    case 'SET_ALL_TEXT_BANIS':
      state.text_bani.allTextBanis = {...action.textBanis};
      break;
    case 'SET_ALL_PARTITIONS':
      state.text_bani.bani_partitions = {...action.partitions};
      break;

    case 'SET_PDF_STAR': {
      const obj = starOrCheckItem(action.item, action.pathBeforeBani, state.pdf.staredPdfs);
      state.pdf.staredPdfs = {...obj};
      break;
    }
    case 'SET_PDF_CHECKBOX': {
      const obj = starOrCheckItem(action.item, action.pathBeforeBani, state.pdf.checkedPdfs);
      state.pdf.checkedPdfs = {...obj};
      break;
    }
    case 'SET_TXT_BANI_STAR': {
      const obj = starOrCheckItem(action.item, action.pathBeforeBani, state.text_bani.staredTextBanis);
      state.text_bani.staredTextBanis = {...obj};
      break;
    }
    case 'SET_TXT_BANI_CHECKBOX': {
      const obj = starOrCheckItem(action.item, action.pathBeforeBani, state.text_bani.checkedTextBanis);
      console.log(obj);
      state.text_bani.checkedTextBanis = {...obj};
      break;
    }
    case 'CACHE_BANI':
      state.text_bani.cachedBanis[action.token] = action.lines;
      state.text_bani.cachedBanis = {...state.text_bani.cachedBanis};
      break;

    case 'SET_ANG_NUM':
      changePDFsObj(state.pdf.allPdfs, action.theBani, action.fullPath, action.type, {
        angNum: action.angNum,
      });
      state.pdf.allPdfs = {...state.pdf.allPdfs};
      break;
    case 'SET_DARK_MODE':
      state.darkMode = action.mode;
      break;
    case 'SET_CACHE':
      state.cacheType = action.type;
      break;
    case 'ADD_PDF_OR_FOLDER':
      changePDFsObj(state.pdf.allPdfs, action.key, action.fullPath, action.type, {
        value: action.value,
      });
      state.pdf.addedPdfs = state.pdf.allPdfs['Added PDFs'];
      state.pdf.addedPdfs = {...state.pdf.addedPdfs};
      break;
    case 'MOVE_PDF_OR_FOLDER':
      action.listOfItems.forEach(pathLst => {
        const newPathLst = moveFileToFolder(state.pdf.allPdfs, pathLst, action.folderToPutIn);
        const fileName = pathLst[pathLst.length - 1];
        if (fileName in state.pdf.staredPdfs) {
          state.pdf.staredPdfs[fileName].fullPath = newPathLst;
        }
        if (fileName in state.pdf.checkedPdfs) {
          state.pdf.checkedPdfs[fileName].fullPath = newPathLst;
        }
      });
      state.pdf.staredPdfs = {...state.pdf.staredPdfs};
      state.pdf.checkedPdfs = {...state.pdf.checkedPdfs};
      state.pdf.addedPdfs = state.pdf.allPdfs['Added PDFs'];
      state.pdf.allPdfs = {...state.pdf.allPdfs};
      break;
    case 'DELETE_PDF_OR_FOLDER':
      changePDFsObj(state.pdf.allPdfs, action.key, action.fullPath, action.type);
      state.pdf.addedPdfs = state.pdf.allPdfs['Added PDFs'];
      state.pdf.allPdfs = {...state.pdf.allPdfs};
      break;
    case 'SET_FONT_SIZE':
      state.fontSizeForShabad = action.fontSize;
      break;
    case 'ADD_TO_SHABAD_HISTORY':
      state.shabadHistory.push(action.shabadObj);
      state.shabadHistory = [...state.shabadHistory];
      break;
    case 'CLEAR_HISTORY':
      state.shabadHistory = [];
      break;
    case 'TOGGLE_SAVE_FOR_SHABAD': {
      const oldState = state.shabadHistory[action.index].saved;
      state.shabadHistory[action.index].saved = !oldState;
      state.shabadHistory = [...state.shabadHistory];
      break;
    }
    case 'TOGGLE_PDF_VERSION_LIST':
      state = {
        ...state,
        isPdfList: action.mode,
      };
      break;
    case 'SET_SETTINGS_FOR_TEXT_BANI':
      state.text_bani = {...action.settings};
      break;
    default:
      return state;
  }
  state = {...state};
  setData('state', state);
  return state;
}

export default theReducer;
