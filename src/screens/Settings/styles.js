import { Platform, StyleSheet } from 'react-native';
import parentStyles from '../styles';
import styleMerge from '../../utils/styleMerge';
import { colors, fontWeight, fontStack, fontSize } from '../../config/styling';

export default theme =>
  styleMerge(
    parentStyles(theme),
    StyleSheet.create({
      mnemonicWord: {
        paddingTop: 110,
        fontSize: 42,
        lineHeight: 59,
        textDecorationLine: 'underline',
        ...Platform.OS === 'android' ? {
          fontFamily: fontStack.bold,
        } : {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.bold,
        }
      },
      list: {
        borderTopWidth: 0,
        marginTop: 0,
      },
      listItem: {
        paddingBottom: 0,
        paddingTop: 0,
        borderBottomColor: colors.getTheme(theme).border,
        alignItems: 'center',
        justifyContent: 'center',
      },
      listItemTitle: {
        color: colors.getTheme(theme).text,
        fontSize: fontSize.smallest,
        marginLeft: 0,
        ...Platform.OS === 'android' ? {
          fontFamily: fontStack.medium,
        } : {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.medium,
        }
      },
      listItemTitleContainer: {
        height: 60,
        padding: 0,
        marginLeft: 0,
      },
    })
  );
