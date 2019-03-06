import { Platform, StyleSheet } from 'react-native';
import parentStyles from '../styles';
import styleMerge from '../../utils/styleMerge';
import { fontStack, fontWeight } from '../../config/styling';

export default theme => styleMerge(
  parentStyles(theme),
  StyleSheet.create({
    mnemonicWord: {
      fontSize: 42,
      lineHeight: 59,
      textDecorationLine: 'underline',
      ...(Platform.OS === 'android'
        ? {
          fontFamily: fontStack.bold,
        }
        : {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.bold,
        }),
    },
  }),
);
