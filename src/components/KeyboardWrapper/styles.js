import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { colors } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0
    },
    lockedContainer: {
      top: null,
      ...ifIphoneX({ height: 392 }, { height: 360 }),
    },
    keyboard: {
      width: '100%',
      bottom: 0,
      position: 'absolute',
      ...ifIphoneX({ height: 392 }, { height: 360 }),
    },
  });
