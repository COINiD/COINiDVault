import { StyleSheet } from 'react-native';
import { colors, fontStack } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginLeft: -8,
    },
    pin: {
      height: 32,
      width: 32,

      marginHorizontal: 8,

      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.getTheme(theme).text,

    },
    filled: {
      backgroundColor: colors.getTheme(theme).text,
    },
  });
