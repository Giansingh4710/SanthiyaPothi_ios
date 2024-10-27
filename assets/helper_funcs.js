export function getItemFromFullPath(obj, pathLst) {
  let finalObj = obj;
  for (const item of pathLst) {
    finalObj = finalObj[item];
  }
  return finalObj;
}

export function changePDFsObj(obj, title, pathLst, action, otherData = {}, depth = 0) {
  if (depth + 1 === pathLst.length) {
    if (action === 'SET_CHECKBOX' || action === 'SET_TXT_BANI_CHECKBOX')
      obj[pathLst[depth]][title].checked = !obj[pathLst[depth]][title].checked;
    else if (action === 'SET_ANG_NUM') obj[pathLst[depth]][title].currentAng = otherData.angNum;
    else if (action === 'ADD_PDF_OR_FOLDER') obj[pathLst[depth]][title] = otherData.value;
    else if (action === 'DELETE_PDF_OR_FOLDER') delete obj[pathLst[depth]][title];
    else console.log('nothing happend in changePDFsObj in helper func');
    return;
  }
  changePDFsObj(obj[pathLst[depth]], title, pathLst, action, otherData, depth + 1);
}

export function moveFileToFolder(obj, fromPathLst, toPathList) {
  const oneBeforePathLst = fromPathLst.slice(0, fromPathLst.length - 1);
  const itemToMoveKey = fromPathLst[fromPathLst.length - 1];
  const dir = getItemFromFullPath(obj, oneBeforePathLst);
  const item = dir[itemToMoveKey];
  console.log({dir, itemToMoveKey, oneBeforePathLst, item});
  delete dir[itemToMoveKey];

  const folder = getItemFromFullPath(obj, toPathList);
  folder[itemToMoveKey] = item;
  return [...toPathList, itemToMoveKey];
}

export function chooseTheState(initialState, savedState) {
  // if all the keys in initialState are in savedState then true, else false
  function compareObjects(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return false;
    }
    const keys1 = Object.keys(obj1);
    // const keys2 = Object.keys(obj2);

    for (const key of keys1) {
      if (!(key in obj2)) {
        return false;
      }
      if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        if (!compareObjects(obj1[key], obj2[key])) {
          return false;
        }
      }
    }
    return true;
  }

  const initStateKeysInSavedStates = compareObjects(initialState, savedState);
  if (initStateKeysInSavedStates) {
    return savedState;
  }
  console.log("savedState doesn't contain all the keys in initialState");
  return initialState;
}

export function incrementKey(obj, ind) {
  const lst = Object.keys(obj);
  const newInd = (ind + 1) % lst.length;
  return [lst[newInd], newInd];
}

export function starOrCheckItem(item, path, obj) {
  if (item in obj) {
    // obj[item].on = !obj[item].on;
    delete obj[item];
  } else {
    obj[item] = {
      on: true,
      fullPath: [...path, item],
    };
  }
  return obj;
}
