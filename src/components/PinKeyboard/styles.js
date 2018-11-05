import { StyleSheet } from 'react-native';
import { colors, fontWeight, fontSize } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    container: {
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      elevation: 24,
      backgroundColor: colors.white,
      width: '100%',
      position: 'absolute',
      zIndex: 1000,
      bottom: -100,
      left: 0,
      borderRadius: 10,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    disabledPinTitle: {
      fontSize: fontSize.base,
      fontWeight: '600',
      marginBottom: 4,
    },
    disabledPinText: {
      fontSize: fontSize.smallest,
      color: colors.getTheme(theme).disabled,
    },
    integratedInput: {
      borderBottomColor: colors.lightGray,
      borderBottomWidth: 1,
      flex: 1,
      alignItems: 'center',
      padding: 16,
    },
    keyboard: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 8,
      paddingBottom: 8,
    },
    key: {
      width: 100 / 3 + '%',
      padding: 8,
    },
    icon: {
      alignSelf: 'center',
      marginTop: 8,
      height: 24,
      width: 24,
    },
    keyText: {
      alignSelf: 'center',
      height: 41,
      lineHeight: 38,
      fontSize: 32,
      color: colors.gray,
    },
    TouchID: {
      color: colors.pink,
    },
    FaceID: {
      color: colors.green,
    },
  });
