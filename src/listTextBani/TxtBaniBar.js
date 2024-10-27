import {MainBar} from '../components/mainBarOpt.js';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import {setTxtBaniCheckBox, setTextBaniStar} from '../../redux/actions.js';
import {useDispatch, useSelector} from 'react-redux';

export default function TxtBaniBar({bani_name, index, dataObj, baniObj, fullPath, navigation}) {
  const allTextBanis = useSelector(theState => theState.theReducer.text_bani.allTextBanis);
  const isStared = useSelector(theState => theState.theReducer.text_bani.staredTextBanis[bani_name]?.on);
  const isChecked = useSelector(theState => theState.theReducer.text_bani.checkedTextBanis[bani_name]?.on);
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const dispatch = useDispatch();

  if (baniObj === undefined && dataObj === undefined) return null;

  const isFolder = baniObj ? false : !dataObj[bani_name].ID; // if baniObj is not null, then TxtBaniBar is rendering from StaredItems List
  const text = baniObj ? baniObj.gurmukhiUni : isFolder ? bani_name : dataObj[bani_name].gurmukhiUni;

  return (
    <MainBar
      darkMode={darkMode}
      isFolder={isFolder}
      text={text}
      onClick={() => {
        if (isFolder) {
          let theDataObj = getItemFromFullPath(allTextBanis, fullPath)[bani_name];

          navigation.push('TextBanisListScreen', {
            dataObj: theDataObj,
            title: bani_name,
            fullPath: [...fullPath, bani_name],
          });
        } else {
          navigation.navigate('OpenTextBanis', {
            bani_token: bani_name,
            token_index: index,
            dataObj,
          });
        }
      }}
      onCheckBoxClick={() => dispatch(setTxtBaniCheckBox(bani_name, fullPath))}
      checked={isChecked}
      isStared={isStared}
      onStarClick={() => dispatch(setTextBaniStar(bani_name, fullPath))}
    />
  );
}
