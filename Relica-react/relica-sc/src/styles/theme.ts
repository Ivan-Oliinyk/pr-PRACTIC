import { ITheme } from "../interfaces/styled";

export const baseTheme: ITheme = {
  colors: {
    greyPrimary: "#939393",
    greySecondary: "#d6d6d6",
    greyLight: "#ededed",
    white: "#fff",
    black: "#000",
    blueV1: "#10a5f5",
    blueV2: "#00dbff",
    blueV3: "#00aecb",
    blueV4: "#0b91d9",
    shadow: "#00000008",
  },

  media: {
    extraLarge: "(max-width: 1366px)",
    large: "(max-width: 960px)",
    medium: "(max-width: 720px)",
    small: "(max-width: 540px)",
  },

  // in ms
  durations: {
    ms300: 300,
  },

  // z-index
  order: {
    header: 50,
    modal: 100,
  },

  size: {
    small: 12,
  },
};
