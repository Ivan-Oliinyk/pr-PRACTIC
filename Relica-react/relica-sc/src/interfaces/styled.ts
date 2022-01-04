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
    mobileS: string;
    mobileL: string;
    tablet: string;
    laptop: string;
    desktop: string;
    desktopL: string;
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

  gradients: {
    bluetobluev1: string;
    bluetobluev2: string;
    bluetobluev3: string;
  };

  lineHeight: {
    big: number | string;
    medium: number | string;
    normal: number | string;
    small: number | string;
  };

  weight: {
    bolt: number;
    large: number;
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

  // flex: {
  //   display: string;
  //   flexDirection: string | string;
  //   justifyContent: string | string | string | string | string | string;
  // };
}
