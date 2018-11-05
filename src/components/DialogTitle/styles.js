import { StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, fontStack } from '../../config/styling';
import { ifAndroid } from '../../utils/device';

export default StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    zIndex: 100,
    position: 'relative',
    backgroundColor: colors.getTheme('light').seeThrough,
    width: '100%',
  },
  title: {
    fontSize: fontSize.smaller,
    textAlign: 'center',
    ...ifAndroid(
      {
        fontFamily: fontStack.bold,
      },
      {
        fontWeight: fontWeight.bold,
      },
    ),
  },
  closeIconContainer: {
    position: 'absolute',
    zIndex: 10,
    right: 19,
    top: 19,
    margin: 0,
    padding: 0,
  },
  closeIconFont: {
    fontSize: 21,
  },
  moreIconContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 19,
    top: 19,
    margin: 0,
    padding: 0,
  },
  moreIconFont: {
    fontSize: 21,
  },
});
