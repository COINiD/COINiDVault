import { StyleSheet } from 'react-native';
import { colors, fontSize } from '../../config/styling';

export default theme => StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 16,
  },
  label: {
    color: colors.getTheme(theme).label,
    flexShrink: 1,
  },
  text: {
    fontSize: fontSize.smallest,
  },
  value: {
    textAlign: 'right',
    flex: 1,
  },
  valueContainer: {},
});
