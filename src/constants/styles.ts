interface IColors {
  black: string;
  white: string;
  dark: string;
  light: string;
  primary: string;
  secondary: string;
  tertiary: string;
  specialDark: string;
  specialMedium: string;
  specialLight: string;
};

export const colors: IColors = {
  black: '#000',
  white: '#fff',
  dark: '#2089dc',
  light: '#00f',
  primary: '#181716',
  secondary: '#2a2727',
  tertiary: '#393433',
  specialDark: '#a550cb',
  specialMedium: '#d980ff',
  specialLight: '#ffb2ff',
};

interface ISizes {
  one: number,
  two: number,
  base: number,
  small: number,
  font: number,
  medium: number,
  large: number,
  xl: number,
  xxl: number,
};

export const sizes: ISizes = {
  one: 1,
  two: 2,
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xl: 24,
  xxl: 32,
};

interface IFonts {
  light: string,
  regular: string,
  bold: string,
  medium: string,
};

export const fonts: IFonts = {
  light: 'Roboto-Light',
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold',
  medium: 'Roboto-Medium',
};