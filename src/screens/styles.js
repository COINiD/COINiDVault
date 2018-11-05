import { StyleSheet } from 'react-native';
import { ifSmallDevice } from '../utils/device';
import { colors, layout } from '../config/styling';

export default theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: layout.paddingTop,
      paddingBottom: layout.paddingBottom,
      paddingHorizontal: layout.paddingHorizontal,
      backgroundColor: colors.getTheme(theme).background,
    },
    topContainer: {
      flex: 1,
    },
    supportText: {
      textAlign: 'center',
      color: colors.getTheme(theme).disabled,
    },
    bottomContainer: {},
    bottomButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: -10,
      paddingTop: 18,
    },
    spaceBetween: {
      flex: 2,
      paddingTop: 32,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    flexEnd: {
      flex: 2,
      paddingBottom: 32,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    highlightText: {
      color: colors.getTheme(theme).highlight,
    },
    warningText: {
      color: colors.orange,
    },
    opacityBackground: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 100,
    },
    borderTop: {
      borderTopWidth: 1,
      borderTopColor: colors.getTheme(theme).border,
    },
    topIcon: {
      position: 'absolute',
      right: -8,
      zIndex: 10,
      width: 32,
      height: 32,
      margin: 0,
      ...ifSmallDevice({ top: -12 }, { top: -36 }),
    },
    topIconLeft: {
      left: -8,
    },
    topButton: {
      position: 'absolute',
      right: -5,
      top: -68,
      ...ifSmallDevice({ top: -44 }, { top: -68 }),
    },
    prevNextBtn: {
      flex: 1,
      marginHorizontal: 10,
      marginTop: 0,
      flexBasis: 23,
    },
    wordInput: {
      marginTop: 32,
      height: 52,
      lineHeight: 38,
      fontSize: 32,
      color: colors.getTheme(theme).text,
      borderColor: colors.getTheme(theme).text,
      paddingBottom: 6,
      borderBottomWidth: 3,
    },
    inputFocused: {
      borderColor: 'rgba(10, 15, 23, 1)',
    },
    inputBlurred: {
      borderColor: 'rgba(10, 15, 23, 0.25)',
    },
  });
