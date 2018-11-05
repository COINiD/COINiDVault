import { StyleSheet } from 'react-native';
import parentStyles from '../styles';
import styleMerge from '../../utils/styleMerge';

export default theme =>
  styleMerge(
    parentStyles(theme),
    StyleSheet.create({
      mnemonicCount: {
        marginTop: 100,
      },
      mnemonicWord: {
        textDecorationLine: 'underline',
      },
      wordButton: {
        flex: 1,
        marginTop: 0,
        marginHorizontal: 10,
        flexBasis: 23,
      },
    })
  );
