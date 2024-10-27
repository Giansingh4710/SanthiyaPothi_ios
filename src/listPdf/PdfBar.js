import {MainBar} from '../components/mainBarOpt.js';
import {getItemFromFullPath} from '../../assets/helper_funcs.js';
import {setPdfCheckBox, setPDFStar} from '../../redux/actions.js';
import {useSelector, useDispatch} from 'react-redux';

export default function PdfBar({bani_name, dataObj, fullPath, navigation}) {
  const allPdfs = useSelector(theState => theState.theReducer.pdf.allPdfs);
  const isStared = useSelector(theState => theState.theReducer.pdf.staredPdfs[bani_name]?.on);
  const isChecked = useSelector(theState => theState.theReducer.pdf.checkedPdfs[bani_name]?.on);
  const darkMode = useSelector(theState => theState.theReducer.darkMode);
  const dispatch = useDispatch();

  const isFolder = dataObj ? !dataObj[bani_name].currentAng : false;

  return (
    <MainBar
      darkMode={darkMode}
      isFolder={isFolder}
      text={bani_name}
      onClick={() => {
        if (isFolder) {
          let theDataObj = getItemFromFullPath(allPdfs, fullPath)[bani_name];

          let screenName = 'PdfListScreen';
          if (bani_name === 'Added PDFs' || (fullPath.length > 0 && fullPath[0] === 'Added PDFs')) {
            screenName = 'AddedPdfs';
          }

          navigation.push(screenName, {
            dataObj: theDataObj,
            title: bani_name,
            fullPath: [...fullPath, bani_name],
          });
        } else {
          navigation.navigate('OpenPdf', {
            pdfTitle: bani_name,
            fullPath: [...fullPath],
          });
        }
      }}
      onCheckBoxClick={() => dispatch(setPdfCheckBox(bani_name, fullPath))}
      checked={isChecked}
      isStared={isStared}
      onStarClick={() => dispatch(setPDFStar(bani_name, fullPath))}
    />
  );
}
