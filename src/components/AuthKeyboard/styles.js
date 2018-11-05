import { Platform, StyleSheet } from 'react-native';
import { colors, fontStack, fontSize, fontWeight } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    filledStyle: {
      backgroundColor: '#00D6B0',
      borderColor: '#00D6B0',
    },
    pinStyle: {
      height: 24,
      width: 24,
    },
    errorFilledStyle: {
      borderColor: '#FA503C',
      backgroundColor: '#FA503C',
    },
    disabledPinStyle: {
      borderColor: '#C4C4C4',
      backgroundColor: '#C4C4C4',
    },
    message: {
      fontSize: fontSize.tiny,
      ...Platform.OS === 'android' ? {
        fontFamily: fontStack.book,
      } : {
        fontFamily: fontStack.primary,
        fontWeight: fontWeight.book,
      }
    },
    infoMessage: {
      marginBottom: 12,
    },
    errorMessage: {
      position: 'absolute',
      bottom: 4,
      color: colors.orange,
    },
  });
