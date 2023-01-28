import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions} from 'react-native';

export function isPortrait() {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
}

export function heightOfBar() {
  if (isPortrait()) {
    return getStatusBarHeight() + 85;
  }
  return getStatusBarHeight() + 40;
}
