import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontStack, fontWeight } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    pinInfo: {
      fontSize: fontSize.tiny,
      textAlign: 'center',
      ...Platform.OS === 'android' ? {
        fontFamily: fontStack.book,
      } : {
        fontFamily: fontStack.primary,
        fontWeight: fontWeight.book,
      }
    },
    pinCode: {
      height: 34,
      fontSize: fontSize.larger,
      letterSpacing: 9,
      ...Platform.OS === 'android' ? {
        fontFamily: fontStack.medium,
      } : {
        fontFamily: fontStack.primary,
        fontWeight: fontWeight.medium,
      }
    },
    pinIndicator: {
      width: 1,
      height: 34,
      backgroundColor: colors.green,
    },
    pinCodeWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
  });
