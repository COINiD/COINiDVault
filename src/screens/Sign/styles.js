import { StyleSheet } from 'react-native';
import parentStyles from '../styles';
import styleMerge from '../../utils/styleMerge';
import { colors, fontWeight, layout } from '../../config/styling';

export default theme =>
  styleMerge(
    parentStyles(theme),
    StyleSheet.create({
      schemeOwner: {
        marginTop: 24,
        marginBottom: 8,
      },
      outputsContainer: {
        overflow: 'visible',
        marginHorizontal: -layout.paddingHorizontal,
        paddingHorizontal: layout.paddingHorizontal,
      },
      txRow: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.getTheme(theme).border,
        paddingBottom: 24,
      },
      txRowLast: {
        marginBottom: 0,
        borderBottomWidth: 0,
      },
    })
  );
