export interface ITheme {
  colors: {
    greyPrimary: string;
    greySecondary: string;
    greyLight: string;
    white: string;
    black: string;
    blueV1: string;
    blueV2: string;
    blueV3: string;
    blueV4: string;
    shadow: string;
  };

  media: {
    extraLarge: string;
    large: string;
    medium: string;
    small: string;
  };

  // in ms
  durations: {
    ms300: number;
  };

  // z-index
  order: {
    header: number;
    modal: number;
  };

  size: {
    titleBig: string;
    titleMedium: string;
    titleSmall: string;
    big: string;
    medium: string;
    base: string;
    small: string;
    little: string;
  };

  lineHeight: {
    big: number | string;
    medium: number | string;
    normal: number | string;
    small: number | string;
  };

  weight: {
    bolt: number;
    medium: number;
    normal: number;
  };

  width: {
    full: string;
    half: string;
    fullScreen: string;
    fullHeight: string;
    halfHeight: string;
  };
}
