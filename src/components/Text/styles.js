import { Platform, StyleSheet } from 'react-native';
import { ifAndroid, ifSmallDevice } from '../../utils/device';
import { colors, fontStack, fontSize, fontWeight } from '../../config/styling';

export default theme =>
  StyleSheet.create({
    text: {
      backgroundColor: 'transparent',
      color: colors.getTheme(theme).text,
      fontSize: fontSize.base,
      fontFamily: fontStack.primary,
      ...ifAndroid(
        {
          fontFamily: fontStack.medium,
        },
        {
          fontWeight: fontWeight.medium,
        }
      ),
    },
    p: {
      marginBottom: 8,
    },
    h1: {
      marginBottom: 28,
      paddingTop: 20,
      fontSize: fontSize.largest,
      letterSpacing: 0.02,
      ...ifAndroid(
        {
          fontFamily: fontStack.black,
        },
        {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.black,
        }
      ),
    },
    h2: {
      marginBottom: 16,
      fontSize: fontSize.larger,
      letterSpacing: 0,
      ...ifSmallDevice({ marginTop: 18 }),
      ...ifAndroid(
        {
          fontFamily: fontStack.bold,
        },
        {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.bold,
        }
      ),
    },
    h3: {
      marginBottom: 16,
      fontSize: fontSize.larger,
      letterSpacing: 0,
      ...ifAndroid(
        {
          fontFamily: fontStack.medium,
        },
        {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.medium,
        }
      ),
    },
    button: {
      margin: 0,
      fontSize: fontSize.smaller,
      ...ifAndroid(
        {
          fontFamily: fontStack.medium,
        },
        {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.medium,
        }
      ),
    },
    weightBold: {
      ...ifAndroid(
        {
          fontFamily: fontStack.bold,
        },
        {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.bold,
        }
      ),
    },
    weightMedium: {
      ...ifAndroid(
        {
          fontFamily: fontStack.medium,
        },
        {
          fontFamily: fontStack.primary,
          fontWeight: fontWeight.medium,
        }
      ),
    },
  });
