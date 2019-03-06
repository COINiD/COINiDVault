import { Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { ifSmallDevice } from '../utils/device';

export const colors = {
  black: '#000',
  blue: '#04234A',
  darkGray: '#0A0F17',
  gray: '#2A2937',
  green: '#00D6B0',
  lightGray: '#D8D8D8',
  mediumGray: '#8A8A8F',
  anotherGray: '#F5F5F5',
  orange: '#FA503C',
  pink: '#EC4E74',
  purple: '#617AF7',
  white: '#FFFFFF',

  getTheme: (theme) => {
    if (theme === 'dark') {
      return {
        background: colors.purple,
        text: colors.darkGray,
        highlight: colors.white,
        button: colors.gray,
        buttonText: colors.white,
        border: colors.lightGray,
        label: colors.mediumGray,
        secondaryButton: colors.white,
        secondaryButtonText: colors.purple,
        linkText: colors.darkGray,
        disabled: colors.mediumGray,
      };
    }

    if (theme === 'darkblue') {
      return {
        background: colors.gray,
        text: colors.white,
        highlight: colors.white,
        button: colors.white,
        buttonText: colors.gray,
        border: colors.white,
        label: colors.white,
        secondaryButton: colors.white,
        secondaryButtonText: colors.gray,
        linkText: colors.white,
        disabled: colors.white,
      };
    }

    return {
      background: colors.white,
      text: colors.darkGray,
      highlight: colors.purple,
      button: colors.purple,
      buttonText: colors.white,
      border: colors.lightGray,
      label: colors.mediumGray,
      secondaryButton: colors.gray,
      secondaryButtonText: colors.white,
      linkText: colors.purple,
      disabled: colors.mediumGray,
    };
  },
};

export const fontSize = ifSmallDevice(
  {
    tiny: 12,
    smallest: 14,
    smaller: 16,
    base: 18,
    larger: 24,
    largest: 36,
  },
  {
    tiny: 12,
    smallest: 16,
    smaller: 18,
    base: 22,
    larger: 28,
    largest: 40,
  },
);

export const fontStack = {
  primary: Platform.OS === 'android' ? 'Inter-UI' : 'Inter UI',
  icons: 'MaterialIcons-Regular',
  book: 'Inter-UI-Book',
  medium: 'Inter-UI-Medium',
  bold: 'Inter-UI-Bold',
  black: 'Inter-UI-Black',
};

export const fontWeight = {
  book: '300',
  normal: '400',
  medium: '500',
  bold: '700',
  black: '900',
};

export const layout = {
  paddingHorizontal: 24,
  ...ifSmallDevice(
    { paddingTop: 38, paddingBottom: 16 },
    ifIphoneX({ paddingTop: 100, paddingBottom: 58 }, { paddingTop: 80, paddingBottom: 24 }),
  ),
};
