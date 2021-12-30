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
    small: number;
  };
}
