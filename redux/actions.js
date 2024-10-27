export const setTheState = state => dispatch => {
  dispatch({
    type: 'SET_THE_STATE',
    state,
  });
};
export const setAngNum = (fullPath, baniTitle, angNum) => dispatch => {
  dispatch({
    type: 'SET_ANG_NUM',
    fullPath,
    theBani: baniTitle,
    angNum,
  });
};
export const setDarkMode = mode => dispatch => {
  dispatch({
    type: 'SET_DARK_MODE',
    mode,
  });
};
export const setCache = type => dispatch => {
  dispatch({
    type: 'SET_CACHE',
    type,
  });
};

export const cacheBani = (token, lines) => dispatch => {
  dispatch({
    type: 'CACHE_BANI',
    token,
    lines,
  });
};

export const addPDForFolder = (key, value, fullPath) => dispatch => {
  dispatch({
    type: 'ADD_PDF_OR_FOLDER',
    key,
    value,
    fullPath,
  });
};
export const movePDForFolders = (listOfItems, folderToPutIn) => dispatch => {
  dispatch({
    type: 'MOVE_PDF_OR_FOLDER',
    listOfItems,
    folderToPutIn,
  });
};
export const deletePDForFolder = (key, fullPath) => dispatch => {
  dispatch({
    type: 'DELETE_PDF_OR_FOLDER',
    key,
    fullPath,
  });
};
export const setAllPdfs = allPdfs => dispatch => {
  dispatch({
    type: 'SET_ALL_PDF_BANIS',
    allPdfs,
  });
};

export const setAllTextBanis = textBanis => dispatch => {
  dispatch({
    type: 'SET_ALL_TEXT_BANIS',
    textBanis,
  });
};
export const setAllPartitions = partitions => dispatch => {
  dispatch({
    type: 'SET_ALL_PARTITIONS',
    partitions,
  });
};

//--------------------------------
export const setFontSize = fontSize => dispatch => {
  dispatch({
    type: 'SET_FONT_SIZE',
    fontSize,
  });
};
export const addToShabadHistory = shabadObj => dispatch => {
  dispatch({
    type: 'ADD_TO_SHABAD_HISTORY',
    shabadObj,
  });
};
export const clearHistory = () => dispatch => {
  dispatch({
    type: 'CLEAR_HISTORY',
  });
};
export const toggleSaveForShabad = index => dispatch => {
  dispatch({
    type: 'TOGGLE_SAVE_FOR_SHABAD',
    index,
  });
};

//--------------------------------
export const togglePDFVersionList = mode => dispatch => {
  dispatch({
    type: 'TOGGLE_PDF_VERSION_LIST',
    mode,
  });
};

export const setSettingsForTextBani = settings => dispatch => {
  dispatch({
    type: 'SET_SETTINGS_FOR_TEXT_BANI',
    settings,
  });
};

export const setPdfCheckBox = (item, pathBeforeBani) => dispatch => {
  dispatch({
    type: 'SET_PDF_CHECKBOX',
    item,
    pathBeforeBani,
  });
};
export const setPDFStar = (item, pathBeforeBani) => dispatch => {
  dispatch({
    type: 'SET_PDF_STAR',
    item,
    pathBeforeBani,
  });
};
export const setTxtBaniCheckBox = (item, pathBeforeBani) => dispatch => {
  dispatch({
    type: 'SET_TXT_BANI_CHECKBOX',
    item,
    pathBeforeBani,
  });
};

export const setTextBaniStar = (item, pathBeforeBani) => dispatch => {
  dispatch({
    type: 'SET_TXT_BANI_STAR',
    item,
    pathBeforeBani,
  });
};
