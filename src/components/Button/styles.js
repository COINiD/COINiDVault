import { StyleSheet } from 'react-native';
import { colors, fontStack, fontSize, fontWeight } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    button: {
      margin: 0,
      marginTop: 16,
      height: 56,
      paddingHorizontal: 5,
      borderRadius: 8,
      backgroundColor: colors.getTheme(theme).button,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: colors.getTheme(theme).buttonText,
    },
    secondary: {
      backgroundColor: colors.getTheme(theme).secondaryButton,
    },
    secondaryText: {
      color: colors.getTheme(theme).secondaryButtonText,
    },
    disabled: {
      opacity: 0.2,
    },
    link: {
      backgroundColor: 'transparent',
    },
    linkText: {
      color: colors.getTheme(theme).linkText,
    },
    linkTextLoading: {
      color: colors.getTheme(theme).disabled,
    },
  });
