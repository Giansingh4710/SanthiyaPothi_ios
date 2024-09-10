export function getItemFromFullPath(obj, pathLst) {
  let finalObj = obj;
  for (const item of pathLst) {
    finalObj = finalObj[item];
  }
  return finalObj;
}

export function changePDFsObj(
  obj,
  title,
  pathLst,
  action,
  otherData = {},
  depth = 0,
) {
  if (depth + 1 === pathLst.length) {
    if (action === 'SET_CHECKBOX' || action === 'SET_TXT_BANI_CHECKBOX')
      obj[pathLst[depth]][title].checked = !obj[pathLst[depth]][title].checked;
    else if (action === 'SET_ANG_NUM')
      obj[pathLst[depth]][title].currentAng = otherData.angNum;
    else if (action === 'ADD_PDF_OR_FOLDER')
      obj[pathLst[depth]][title] = otherData.value;
    else if (action === 'DELETE_PDF_OR_FOLDER')
      delete obj[pathLst[depth]][title];
    else console.log('nothing happend in changePDFsObj in helper func');
    return;
  }
  changePDFsObj(
    obj[pathLst[depth]],
    title,
    pathLst,
    action,
    otherData,
    depth + 1,
  );
}

function getAllKeys(obj, keys = []) {
  const dontCheck = ['staredPdfs', 'staredTextBanis', 'allPdfs'];
  for (const key in obj) {
    if (dontCheck.includes(key)) continue;
    keys.push(key);
    if (typeof obj[key] === 'object') {
      getAllKeys(obj[key], keys);
    }
  }
  return keys;
}

export function haveSameKeys(obj1, obj2) {
  const allKeys1 = getAllKeys(obj1).sort();
  const allKeys2 = getAllKeys(obj2).sort();
  if (allKeys1.length !== allKeys2.length) {
    console.log(allKeys1.length, allKeys2.length);
    return false;
  }
  for (let i = 0; i < allKeys1.length; i++) {
    if (allKeys1[i] !== allKeys2[i]) {
      console.log(allKeys1[i], allKeys2[i]);
      return false;
    }
  }
  return true;
}

export function incrementKey(obj, ind) {
  const lst = Object.keys(obj);
  const newInd = (ind + 1) % lst.length;
  return [lst[newInd], newInd];
}
