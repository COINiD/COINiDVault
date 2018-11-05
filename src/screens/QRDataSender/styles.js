import { Platform, StyleSheet } from 'react-native';
import parentStyles from '../styles';
import styleMerge from '../../utils/styleMerge';
import { fontStack, fontWeight } from '../../config/styling';

export default theme =>
  styleMerge(
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
      blockContainer: {
        flexDirection: 'row',
        marginTop: 19,
        marginLeft: -22,
        marginRight: -19,
        marginBottom: -19,
      },
      block: {
        backgroundColor: '#DADADA',
        height: 6,
        flex: 1,
        marginLeft: 3,
      },
      activeBlock: {
        backgroundColor: '#617AF7',
      },
      noBlockMargin: {
        marginLeft: 0,
      },
    })
  );
