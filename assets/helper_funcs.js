export function getItemFromFullPath(obj, pathLst) {
  let finalObj = obj;
  for (let item of pathLst) {
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
    if (action === 'SET_CHECKBOX')
      obj[pathLst[depth]][title].checked = !obj[pathLst[depth]][title].checked;
    else if (action === 'SET_ANG_NUM') 
      obj[pathLst[depth]][title].currentAng = otherData.angNum
    else if (action === 'ADD_PDF_OR_FOLDER') 
      obj[pathLst[depth]][title] = otherData.value
    else if (action === 'DELETE_PDF_OR_FOLDER') 
      delete obj[pathLst[depth]][title]
    else
      console.log('nothing happend in changePDFsObj in helper func')
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
