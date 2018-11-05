import { Platform, StyleSheet } from 'react-native';
import { colors, fontStack } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    button: {
      paddingTop: 19,
      paddingBottom: 18,
      paddingHorizontal: 5,
      backgroundColor: colors.getTheme(theme).button,
      margin: 0,
      marginTop: 28,
    },
    buttonText: {
      color: colors.getTheme(theme).buttonText,
      fontSize: 18,
      ...Platform.OS === 'android' ? {
        fontFamily: fontStack.bold,
      } : {
        fontFamily: fontStack.primary,
        fontWeight: fontWeight.bold,
      }
    },
    secondary: {
      backgroundColor: colors.getTheme(theme).secondaryButton,
    },
    secondaryText: {
      color: colors.getTheme(theme).secondaryButtonText,
    },
  });
