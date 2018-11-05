import { StyleSheet } from 'react-native';
import { colors, fontSize, fontStack } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: 16,
    },
    label: {
      color: colors.getTheme(theme).label,
    },
    text: {
      fontSize: fontSize.smallest,
    },
  });
